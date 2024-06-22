//
//https://github.com/PacktPublishing/Hands-on-Machine-Learning-with-TensorFlow.js/tree/master/Section5_4
//
const tf = require("@tensorflow/tfjs");
//require('@tensorflow/tfjs-node');
//load iris training and testing data
const vitalsign = require("../../vitalsign.json");
var lossValue;
//
exports.trainAndPredictUserInput = function (req, res) {
  const vitalSignTestingUser = [req.body];
  console.log(vitalSignTestingUser);
  //
  // convert/setup our data for tensorflow.js
  //
  //tensor of features for training data
  // include only features, not the output
  const trainingData = tf.tensor2d(
    vitalsign.map((item) => [
      item.temperature,
      item.bloodPressure,
      item.heartRate,
      item.respiratoryRate,
    ])
  );
  //console.log(trainingData.dataSync())
  //
  //tensor of output for training data
  //the values for species will be:
  // critical:       1,0,0
  // followup:    0,1,0
  // healthy:   0,0,1
  const outputData = tf.tensor2d(
    vitalsign.map((item) => [
      item.outcome === "critical" ? 1 : 0,
      item.outcome === "followup" ? 1 : 0,
      item.outcome === "healthy" ? 1 : 0,
    ])
  );
  //
  //tensor of features for testing data
  const testingData = tf.tensor2d(
    vitalSignTestingUser.map((item) => [
      item.temperature,
      item.bloodPressure,
      item.heartRate,
      item.respiratoryRate,
    ])
  );
  //
  // build neural network using a sequential model
  const model = tf.sequential();
  //add the first layer
  model.add(
    tf.layers.dense({
      inputShape: [4], // four input neurons
      activation: "sigmoid",
      units: 5, //dimension of output space (first hidden layer)
    })
  );
  //add the hidden layer
  model.add(
    tf.layers.dense({
      inputShape: [5], //dimension of hidden layer
      activation: "sigmoid",
      units: 3, //dimension of final output (critical,followup,healthy)
    })
  );
  //add output layer
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 3, //dimension of final output (critical,followup,healthy)
    })
  );
  //compile the model with an MSE loss function and Adam algorithm
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.06),
  });
  console.log(model.summary());
  //
  //Train the model and predict the results for testing data
  //
  // train/fit the model for the fixed number of epochs
  async function run() {
    const startTime = Date.now();
    //train the model
    await model.fit(trainingData, outputData, {
      epochs: 100,
      callbacks: {
        //list of callbacks to be called during training
        onEpochEnd: async (epoch, log) => {
          lossValue = log.loss;
          console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
          elapsedTime = Date.now() - startTime;
          console.log("elapsed time: " + elapsedTime);
        },
      },
    });

    const results = model.predict(testingData);
    //console.log('prediction results: ', results.dataSync())
    //results.print()

    // get the values from the tf.Tensor
    //var tensorData = results.dataSync();
    results.array().then((array) => {
      console.log(array[0][0]);
      var resultForData1 = array[0];
      var resultForData2 = array[1];
      var resultForData3 = array[2];
      var dataToSent = {
        row1: resultForData1,
        row2: resultForData2,
        row3: resultForData3,
      };
      console.log(resultForData1);
      // uncommment this when client is React
      res.status(200).send(dataToSent);
      //
      // comment this when client is React
      /*
            res.render('results',
                {
                    elapsedTime: elapsedTime / 1000,
                    lossValue: lossValue,
                    resultForData1: resultForData1[0],
                    resultForData2: resultForData2[0],
                    resultForData3: resultForData3[0]
                }
            )
            */
    });
  } //end of run function
  // call the run function
  run();
};
