"use strict";

const calcButton = document.querySelector(".btn-calc");
const resetButton = document.querySelector(".btn-reset");
const howToUse = document.querySelector(".use-link");
const howItWorks = document.querySelector(".works-link");
const closeBtns = document.querySelectorAll(".btn-close");

const calcTotalReturn = function(principal, apr, timeframe, nmbrOfCompounds, txnCost) {
    //timeframe is in years

    const compoundingFrequency = nmbrOfCompounds/timeframe;
    //per the formula, a compounding frequency of 1 returns the noncompounded value; the ideal number of compunds therefore, will be one less than what the test returns
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
        (every ${Math.round(365 / optimalCompoundsPerYear * 10) / 10} days)`;
    } else if (optimalCompoundsPerYear < 365) {
        document.getElementById("optimal-compounding-interval").textContent = 
        `${Math.trunc(optimalCompoundsPerYear)} times per year 
        (every ${Math.round(12 / optimalCompoundsPerYear * 100) / 100} months)`;
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

const init = function() {
    document.getElementById("optimal-compounding-interval").textContent = "to be computed";
    document.getElementById("optimal-apy").textContent = "to be computed";
    document.getElementById("principal").value = "10000.00";
    document.getElementById("apr").value = "5.00";
    document.getElementById("timeframe").value = "1.0";
    document.getElementById("cost").value = ".0100";
    document.querySelector(".results-msg").innerHTML = "";
}

const testCompoundingIntervals = function(principal, apr, timeframe, txnCost) {
    //tests compounding intervals starting at 0 and increasing until the total return is less than the preceeding interval
    
    const totalReturnArr = [];
    for (let i = 1; i <= 10000; i++) {
        totalReturnArr.push(calcTotalReturn(principal, apr, timeframe, i, txnCost));
        console.log(`Compounds: ${i - 1}; Total Return: ${totalReturnArr[i -1]}`);
        if (totalReturnArr[i - 2] && totalReturnArr[i - 1] < totalReturnArr[i - 2]) return totalReturnArr;
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

closeBtns.forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("how-it-works").classList.add("hidden");
    document.getElementById("how-to-use").classList.add("hidden");
}));

howItWorks.addEventListener("click", () => {
    document.getElementById("how-to-use").classList.add("hidden");
    document.getElementById("how-it-works").classList.remove("hidden");
});

howToUse.addEventListener("click", () => {
    document.getElementById("how-to-use").classList.remove("hidden");
    document.getElementById("how-it-works").classList.add("hidden");
});

resetButton.addEventListener("click", init);

init();


