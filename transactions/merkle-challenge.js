import { compile, compileUnlock, generateP2trAddressInfo, DUST_LIMIT, computeCblock } from './utils.js'
import { pushHex, pushHexEndian } from '../opcodes/utils.js'
import { bit_state, bit_state_commit, bit_state_unlock } from '../opcodes/u32/u32_state.js'
import { u160_state_commit, u160_state_unlock, u160_state, u160_equalverify, u160_push, u160_swap_endian, u160_toaltstack, u160_fromaltstack } from '../opcodes/u160/u160_std.js'
import { Tap, Tx, Address, Signer } from '../libs/tapscript.js'
import { broadcastTransaction } from '../libs/esplora.js'
import { blake3_160 } from '../opcodes/blake3/blake3.js'
import { computeJusticeRoot } from './reveal-challenge.js'


const IDENTIFIER_MERKLE = 'MERKLE_CHALLENGE'

// Depth of the Merkle tree 
const N = 32
// Number of queries we need
const H = 5 // = log2(N)


export function selectorLeaf(vicky, length, isAbove = 0) {
    if (length >= H) throw `length >= ${ H }`

    return [

        OP_RIPEMD160,
        vicky.hashlock(IDENTIFIER_MERKLE, length, isAbove),
        OP_EQUALVERIFY,

        // sibelIndex = i0 i1 i2 ... i_{length-1} 1 0 0 ... 0 0
        0,
        loop(length, i => [
            OP_SWAP,
            bit_state(vicky, `merkle_challenge_${i}`),
            OP_IF,
                2 ** (H - i - 1),
                OP_ADD,
            OP_ENDIF
        ]),
        2 ** (H - 1 - length),
        OP_ADD,
        OP_TOALTSTACK,
        // Now sibelIndex is on the stack


        // endIndex
        0,
        loop(H, i => [
            OP_SWAP,
            bit_state(vicky, `merkle_challenge_${i}`),
            OP_IF,
                2 ** (H - i - 1),
                OP_ADD,
            OP_ENDIF
        ]),
        // Now endIndex is on the stack


        // check  |sibelIndex - endIndex| == 1
        // 
        OP_FROMALTSTACK,
        OP_SUB,
        isAbove ? OP_NEGATE : '',
        OP_1,
        OP_NUMEQUALVERIFY,
        OP_TRUE   // TODO: verify the covenant here
    ]
}


function trailingZeros(n) {
    let count = 0;
    while ((n & 1) === 0 && n !== 0) count++, n >>= 1;
    return count;
}


export function selectorLeafUnlock(
    vicky, endIndex, sibelIndex, isAbove
) {
    const length = H - trailingZeros(sibelIndex) - 1
    return [

        // endIndex
        loop(H, i => bit_state_unlock(vicky, `merkle_challenge_${H - 1 - i}`, endIndex >>> i & 1)),

        // sibelIndex
        loop(length, i => bit_state_unlock(vicky, `merkle_challenge_${length - i - 1}`, sibelIndex >>> (H - length + i) & 1)),

        // unlock the corresponding challenge
        vicky.preimage( IDENTIFIER_MERKLE, length, isAbove),
    ]
}


export function computeSelectorRoot(vicky) {
    return [
        selectorLeaf(vicky, 0, 0),
        selectorLeaf(vicky, 1, 0),
        selectorLeaf(vicky, 2, 0),
        selectorLeaf(vicky, 3, 0),

        selectorLeaf(vicky, 0, 1),
        selectorLeaf(vicky, 1, 1),
        selectorLeaf(vicky, 2, 1),
        selectorLeaf(vicky, 3, 1),
    ].map(compile)
}


export function challengeLeaf(
    vicky, paul, index, isAbove = 0
) {
    return [
        OP_RIPEMD160,
        vicky.hashlock(IDENTIFIER_MERKLE, index, isAbove),
        OP_EQUALVERIFY,
        u160_state(paul, `merkle_response_${ isAbove ? index : H }`),
        blake3_160,
        u160_toaltstack,
        u160_state(paul, `merkle_response_${ isAbove ? H : index }`),
        // TODO: add root here 
        u160_fromaltstack,
        u160_swap_endian,
        u160_equalverify,
        OP_TRUE, // TODO: verify the covenant here
    ]
}

export function challengeLeafUnlock(
    vicky, paul, index, sibling, childHash, parentHash, merkleIndex, isAbove
) {
    return [
        u160_state_unlock(paul, `merkle_response_${H}`, parentHash),
        pushHexEndian(sibling),
        u160_state_unlock(paul, `merkle_response_${index}`, childHash),
        vicky.preimage( IDENTIFIER_MERKLE, index, isAbove),
    ]
}


export function computeChallengeRoot(vicky, paul) {
    return [
        challengeLeaf(vicky, paul, 0, 0),
        challengeLeaf(vicky, paul, 1, 0),
        challengeLeaf(vicky, paul, 2, 0),
        challengeLeaf(vicky, paul, 3, 0),

        challengeLeaf(vicky, paul, 0, 1),
        challengeLeaf(vicky, paul, 1, 1),
        challengeLeaf(vicky, paul, 2, 1),
        challengeLeaf(vicky, paul, 3, 1)
    ].map(compile)
}

function computeTree(actor, scripts) {
    const tree = scripts.map(s => Tap.encodeScript(s))

    const [tseckey] = Tap.getSecKey(actor.seckey, { tree })
    const [tpubkey, _] = Tap.getPubKey(actor.pubkey, { tree })

    // A taproot address is simply the tweaked public key, encoded in bech32 format.
    const address = Address.p2tr.fromPubKey(tpubkey, 'signet')

    return { address, tree, scripts }
}



export function fundingAddress(vicky) {
    return computeTree(vicky, computeSelectorRoot(vicky)).address
}

function disproveMerkleRoot(vicky, paul, index){
    // TODO: we can optimize this. only a single bit is required to prove non-equality of two hashes
    return loop(32, i => [

        // TODO: Verify that we're in the case containing the root hash of the Merkle path
        // verify for i in [0..H]: merkle_challenge_i == 0

        // TODO: Verify that we're picking the correct root from the trace
        // verify sum(for i in [0..32], 2**i * trace_challenge_i) == index

        u160_state(paul, `merkle_response_${H}`),
        u160_toaltstack,
        u160_state(paul, `trace_response_${index}`),
        u160_fromaltstack,
        u160_equalverify, // TODO: should be u160_NOTequalverify
        OP_TRUE // TODO: verify the covenant here
    ])
}


export function computeMerkleJusticeRoot(vicky, paul, roundCount) {
    // The tree contains all equivocation leaves
    return [
        ...computeJusticeRoot(vicky, paul, roundCount, 'merkle'),
        ...disproveMerkleRoot(vicky, paul)
    ].map(compile)
}


export function createMerkleChallenge(vicky, paul, outpoint) {
    const selectRoot    = computeTree(vicky, computeSelectorRoot(vicky))
    const challengeRoot = computeTree(paul,  computeChallengeRoot(vicky, paul))
    const justiceRoot   = computeTree(vicky, computeMerkleJusticeRoot(vicky, paul, H))

    const selectTx = Tx.create({
        vin: [{
            txid: outpoint.txid,
            vout: outpoint.vout,
            prevout: {
                value: outpoint.value,
                scriptPubKey: Address.toScriptPubKey(selectRoot.address)
            },
        }],
        vout: [{
            value: outpoint.value - 1000, // TODO: fees here
            scriptPubKey: Address.toScriptPubKey(challengeRoot.address)
        }]
    })
    const selectTxhex = Tx.encode(selectTx).hex
    const selectTxid = Tx.util.getTxid(selectTxhex)

    const challengeTx = Tx.create({
        vin: [{
            txid: selectTxid,
            vout: 0,
            prevout: {
                value: selectTx.vout[0].value,
                scriptPubKey: Address.toScriptPubKey(challengeRoot.address)
            },
        }],
        vout: [{
            value: selectTx.vout[0].value - 50000, // TODO: fees here
            scriptPubKey: Address.toScriptPubKey(justiceRoot.address)
        }]
    })
    const challengeTxhex = Tx.encode(challengeTx).hex
    const challengeTxid = Tx.util.getTxid(challengeTxhex)


    const justiceTx = Tx.create({
        vin: [{
            txid: challengeTxid,
            vout: 0,
            prevout: {
                value: challengeTx.vout[0].value,
                scriptPubKey: Address.toScriptPubKey(justiceRoot.address)
            },
        }],
        vout: [{
            value: 500,
            scriptPubKey: Address.toScriptPubKey('tb1pq7u2ujdvjzsy36d4xdt6yd2txv6wnj97aqf7ewvwnxn7ql5v8w3sg98j36')
        }]
    })


    return [
        { root: selectRoot, tx: selectTx },
        { root: challengeRoot, tx: challengeTx },
        { root: justiceRoot, tx: justiceTx }
    ]
}


export async function executeSelectTx(
    vicky, rounds, index, isAbove, value
) {
    const round = rounds.pop()
    const tx = round.tx
    const script = round.root.scripts[index]
    const cblock = computeCblock(vicky, round.root.tree, index)
    const unlockScript = compileUnlock(selectorLeafUnlock(vicky, value, value + (isAbove ? 1 : -1), isAbove))
    tx.vin[0].witness = [ ...unlockScript, script, cblock ]
    const txhex = Tx.encode(tx).hex
    await broadcastTransaction(txhex)
    console.log('selectTx broadcasted')
}


export async function executeChallengeTx(
    vicky, paul, rounds, index, isAbove, sibling, hash1, hash2
) {
    const round = rounds.pop()
    const tx = round.tx
    const script = round.root.scripts[index]
    const cblock = computeCblock(paul, round.root.tree, index)
    const unlockScript = compileUnlock(challengeLeafUnlock(
        vicky, paul, 0, sibling, hash1, hash2, 0, isAbove ))

    tx.vin[0].witness = [ ...unlockScript, script, cblock ]
    const txhex = Tx.encode(tx).hex
    await broadcastTransaction(txhex)
    console.log('challengeTx broadcasted')
}



