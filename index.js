addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const URL="https://cfw-takehome.developers.workers.dev/api/variants"
/**
 * Respond with hello worker text
 * @param {Request} request
 */

//Fetch call to this url https://cfw-takehome.developers.workers.dev/api/variants
//write a logic A/B testing
//random library (read for interview)
async function handleRequest(request) {
const apiResponse = await fetchResult()
const finalresponse=await apiResponse.json()
let selectedRandomUrl=fetchRandomVariant(finalresponse)
 return new Response(JSON.stringify(finalresponse), {
    headers: { 'content-type': 'text/plain' },
  })
}

const fetchResult = () => {
    return fetch(URL)
}

const fetchRandomVariant = (variants) => {
  let a=Math.random(Math.random())
  return fetch(variants[a])
}




