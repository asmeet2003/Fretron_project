const readline = require('readline');

function distributeApples() {
    const appleWeights = [];
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askForWeight() {
        rl.question("Enter apple weight in grams (-1 to stop): ", (answer) => {
            const inputWeight = parseInt(answer);

            if (inputWeight === -1) {
                rl.close();
                distribute();
            } else if (isNaN(inputWeight) || inputWeight <= 0) {
                console.log("Please enter a valid positive number.");
                askForWeight();
            } else {
                appleWeights.push(inputWeight);
                askForWeight();
            }
        });
    }

    function distribute() {
        appleWeights.sort((a, b) => b - a);

        const totalAmount = 100;
        const amountsPaid = {
            Ram: 50,
            Sham: 30,
            Rahim: 20
        };

        const totalWeight = appleWeights.reduce((sum, weight) => sum + weight, 0);
        const targetWeights = {
            Ram: totalWeight * (amountsPaid.Ram / totalAmount),
            Sham: totalWeight * (amountsPaid.Sham / totalAmount),
            Rahim: totalWeight * (amountsPaid.Rahim / totalAmount)
        };

        const result = {
            Ram: [],
            Sham: [],
            Rahim: []
        };

        function distributeFor(person) {
            let remainingWeight = targetWeights[person];

            for (let i = 0; i < appleWeights.length; i++) {
                if (appleWeights[i] <= remainingWeight) {
                    result[person].push(appleWeights[i]);
                    remainingWeight -= appleWeights[i];
                    appleWeights.splice(i, 1);
                    i--; 
                }
            }
        }

        distributeFor("Ram");
        distributeFor("Sham");
        distributeFor("Rahim");

        console.log("Distribution Result:");
        console.log("Ram:", result.Ram.join(", "));
        console.log("Sham:", result.Sham.join(", "));
        console.log("Rahim:", result.Rahim.join(", "));
    }

    askForWeight();
}

distributeApples();
