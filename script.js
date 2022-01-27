"use strict";

const calcButton = document.querySelector(".btn-calc");
const clrButton = document.querySelector(".btn-clear")

const calcTotalReturn = function(principal, apr, timeframe, nmbrOfCompounds, txnCost) {
    //timeframe is in years

    const compoundingFrequency = nmbrOfCompounds/timeframe;
    const totalReturn =
        principal * (1 + apr/compoundingFrequency) ** (compoundingFrequency * timeframe) - txnCost * nmbrOfCompounds;
    return totalReturn;
};

const displayResults = function(optimalCompounds, optimalReturn, timeframe, principal, apr) {
    const optimalCompoundsPerYear = optimalCompounds / timeframe;
    const optimalAPY = ((optimalReturn - principal) / principal) / timeframe;

    
    //Optimal compunding interval -- assumes 365/12 day months
    if (optimalCompoundsPerYear === 0) {
        document.getElementById("optimal-compounding-interval").textContent = 
        "0 times per year - cost prohibitive";
    } else if (optimalCompoundsPerYear < 30) {
        document.getElementById("optimal-compounding-interval").textContent = 
        `${Math.trunc(optimalCompoundsPerYear)} times per year 
        (every ${Math.round(365 / optimalCompoundsPerYear, 2)} days)`;
    } else if (optimalCompoundsPerYear < 365) {
        document.getElementById("optimal-compounding-interval").textContent = 
        `${Math.trunc(optimalCompoundsPerYear)} times per year 
        (every ${Math.round(12 / optimalCompoundsPerYear, 2)} months)`;
    } else {
        document.getElementById("optimal-compounding-interval").textContent = 
        `${Math.trunc(optimalCompoundsPerYear)} times per year 
        (every ${Math.round(1 / optimalCompoundsPerYear, 2)} years)`;
    }

    //Optimal APY
    document.getElementById("optimal-apy").textContent =
        `${Math.round((optimalAPY + Number.EPSILON) * 10000) / 100}%`;

    //Summary paragraph
    document.querySelector(".results-msg").innerHTML =
        optimalCompounds === 0
        ? `Transaction costs make it <span class="emphasis">undesirable</span> to compound your returns during your specified time period. <span class="emphasis">Not compounding will produce optimal returns.</span>`
        : `To achieve optimal returns over your specified timeframe, you should <span class="emphasis">compound your returns ${optimalCompounds} time(s).</span> Versus not compounding at all,
        optimal compounding will produce an <span class="emphasis">additional ${Math.round((optimalReturn - (principal + (principal * apr * timeframe))) * 10000) / 10000} in returns</span>, which equates to an <span class="emphasis">additional
        ${Math.round((optimalAPY - apr + Number.EPSILON) *10000) / 100}%</span> in annualized returns.`;
    
    
    
};

const testCompoundingIntervals = function(principal, apr, timeframe, txnCost) {
    //tests compounding intervals starting at 0 and increasing until the total return is less than the preceeding interval
    
    const totalReturnArr = [];
    for (let i = 0; i <= 10000; i++) {
        totalReturnArr.push(calcTotalReturn(principal, apr, timeframe, i, txnCost));
        console.log(`Compounds: ${i}; Total Return: ${totalReturnArr[i]}`);
        if (totalReturnArr[i - 1] && totalReturnArr[i] < totalReturnArr[i-1]) return totalReturnArr;
    }
    console.log("Warning: maximum number of tests reached (10,000)");
    totalReturnArr.push("Maximum tests reached");
    return totalReturnArr;
};

calcButton.addEventListener("click", function() {
    
    //Get input values
    const principal = document.getElementById("principal").valueAsNumber;
    const apr = document.getElementById("apr").valueAsNumber / 100;
    const timeframe = document.getElementById("timeframe").valueAsNumber;
    const cost = document.getElementById("cost").valueAsNumber;

    //Check for valid inputs
    if (!principal || !apr || !timeframe || !cost) {
        alert("ERROR: Principal value, APR, timeframe, and cost per compounding are all required!");
        return;
    }

    //Calculate optimal number of compounding intervals
    const totalReturnArr = testCompoundingIntervals(principal, apr, timeframe, cost);

    //Display results
    displayResults((totalReturnArr.length - 2), totalReturnArr[totalReturnArr.length - 2], timeframe, principal, apr);
});

clrButton.addEventListener("click", function() {
    document.getElementById("principal").value = "";
    document.getElementById("apr").value = "";
    document.getElementById("timeframe").value = "";
    document.getElementById("cost").value = "";
    document.querySelector(".results-msg").innerHTML = "";
});


