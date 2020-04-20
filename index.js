
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })

  
  const NAME = 'temp'
  let new_variant_url=" "
  //Defining the ElementHandler class to support HTMLRewriter which will help us to change the contents of the HTML page
  class ElementHandler {
    constructor(attributeName) {
      this.attributeName = attributeName
  }
   
    element(element) {
      if(element.tagName=="title"){
          if(new_variant_url.includes("1")){
            (element).setInnerContent("New Variant 1")
            console.log("inside title and 1")
          }
          else{
            (element).setInnerContent("New Variant 2")
            console.log("inside title and 1")
          }
      }
      if(element.tagName=="h1"){
        if(new_variant_url.includes("1")){
          (element).setInnerContent("This is New Variant 1")
          console.log("inside h1 and 1")
        }
        else{
          (element).setInnerContent("This is New Variant 2")
          console.log("inside h1 and 1")}
      }
      if(element.tagName=="a"){
        element.setInnerContent("My Github profile")
        const attribute = element.getAttribute(this.attributeName)
          element.setAttribute(this.attributeName,
            attribute.replace("https://cloudflare.com", 'https://github.com/rohitvish30')
          ) 
      }
      if(element.tagName=="p"){
          element.setInnerContent("Cloudflare's worker is one of the best tool that I have ever worked with!")
      }
    }
    }
  
  
// HTML Rewrite class inistantiation
const writeNew = new HTMLRewriter()
                .on('title', new ElementHandler()) // The main heading of the page is given by title tag
                .on('h1', new ElementHandler()) // the header of the page i.e. "Variant 1 or 2" is given by h1#title tag
                .on('p', new ElementHandler()) // the descitption of the page is given by p element tag
                .on('a', new ElementHandler("href")) // the link to www.cloudflare.com is given by the href attribute of the a element tag
                
  

const URL="https://cfw-takehome.developers.workers.dev/api/variants"


// returning the fetch result of the given URL //
const fetchResult = () => { 
  return fetch(URL) 
}


// returning the fetch result of each of the URL with equal probabilities //
const fetchRandomVariant = (array) => {
  var a=Math.round((Math.random())) // Math.random() generates float values ranging between 0 and 1 with equal probabilities and Math.round() will round it to nearest integer 0 or 1
  return fetch((array.variants[a])); // when fetch is used we are getting one specific URL and all Metadata related to that particular URL
  };

  
  
  async function handleRequest(request) {
    const cookie = request.headers.get('cookie')
    let oldURL=null
    if (cookie) {
      let cookies = cookie.split(';')
      cookies.forEach(c => {
        let cookieName = c.split('=')[0].trim()
        if (cookieName === NAME) {
          oldURL = c.split('=')[1]
          console.log("got cookie")
        }
      })
   }

    if(oldURL){
      new_variant_url=oldURL
      res = await fetch(oldURL) 
      console.log("Got old Url")
      return writeNew.transform(res)
    }
    else{
      console.log("No cookie found")
      const apiResponse = await fetchResult() // await - will wait untill fetchResult() gives the output
      const finalresponse=await apiResponse.json() // converting the result of apiresponse to JSON and passing it to finalresponse variable
      let selectedRandomUrl= await fetchRandomVariant(finalresponse) // passing the finalresponse variable to the function generateRandomUrl to generate random URL
      new_variant_url = selectedRandomUrl.url //Selecting the value of the url key
      let response=new Response()
      res = await fetch(new_variant_url) 
      console.log("New Url")
      response=writeNew.transform(res)
      response.headers.append('Set-Cookie', `${NAME}=${new_variant_url};path=/`)
      return response
    }    
        
  }
    


  






