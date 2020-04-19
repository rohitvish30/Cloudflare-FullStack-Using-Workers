addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiResponse = await fetchResult() // await - will wait untill fetchResult() gives the output
  const finalresponse=await apiResponse.json() // converting the result of apiresponse to JSON and passing it to finalresponse variable
  let selectedRandomUrl= await fetchRandomVariant(finalresponse) // passing the finalresponse variable to the function generateRandomUrl to generate random URL
  let a = selectedRandomUrl.url
  let response = Response.redirect(a);
  return response;
    //JSON.stringify(a), { //parsing the JSON object as string and returning the response
     // headers: { 'content-type': 'html' },
      
  //   })
  }



//////////// UTILITY FUNCTIONS ////////////

// returning the fetch result of the mentioned URL //
const URL="https://cfw-takehome.developers.workers.dev/api/variants"

const fetchResult = () => { 
  return fetch(URL) 
}


// Checking the probabilites of each URL //
  var arr = new Array();
  var arr2 = new Array();
  
 const countOccurence = () => {
   var countZero=0
   var countOne=0

  //for(arr.length!=0)
  for(var i=0;i<arr.length;i++)
  {
    if(arr[i]==0)
    {
      countZero++;
    }
    else if(arr[i]==1)
    {
      countOne++;
    }
  }
  var a=(countZero/arr.length);
  var b=(countOne/arr.length);
  return [a,b]; 
 }



// returning the fetch result of each of the URL with equal probabilities //
const fetchRandomVariant = (array) => {
  var a=Math.round((Math.random())) // Math.random() generates float values ranging between 0 and 1 with equal probabilities and Math.round() will round it to nearest integer 0 or 1
  arr.push(a)
  let obj = array;
    //  return (obj.variants[a]); // when fetch is not used we are getting a URL string i.e it is simply returning the 1st or 2nd URL in string
    return fetch((obj.variants[a])); // when fetch is used we are getting one specific URL and all Metadata related to that particular URL
  };

  
  arr2 = countOccurence()
  console.log("Probability of 0: "+arr2[0])
  console.log("Probability of 1: "+arr2[1])
 



  





