const stackstx = require('@stacks/transactions');
const express = require('express');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
   const status = {
      "Status": "Running"
   };
   
   response.send(status);
});

function build_res(code, msg, data) {  
   return {
      code,
      msg,
      data
   }
}  

app.get("/pub2addr/:network/:pub", (request, response) => {
   const addr = stackstx.publicKeyToAddress(request.params.pub, request.params.network);
   const data = {
      'address': addr,
      'network': request.params.network,
      'pubkey': request.params.pub
   }

   response.send(build_res(0,"",data));
});


app.post("/tansfer/stx", async (request, response) => {
   const txOptions = {
      recipient: request.body.recipient,
      amount: BigInt(request.body.amount),
      publicKey: request.body.publicKey,
      network: request.body.network,
      memo: request.body.memo,
      nonce: BigInt(request.body.nonce),
      fee: BigInt(request.body.fee),
   };

   const transaction = await stackstx.makeUnsignedSTXTokenTransfer(txOptions);

   const data = {
      'presign': transaction.signBegin(),
      'rawtx': transaction.serialize(), 
   }

   response.send(build_res(0,"",data));
});

app.post("/tansfer/stx/payload", async (request, response) => {
   const txOptions = {
      recipient: request.body.recipient,
      amount: BigInt(request.body.amount),
      memo: request.body.memo,
   };

   const payload = stackstx.createTokenTransferPayload(txOptions.recipient, txOptions.amount, txOptions.memo);
   const data = {
      'payload': stackstx.serializeStacksWire(payload),
   }

   response.send(build_res(0,"",data));
});