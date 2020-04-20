
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })

  
  const NAME = 'temp' // This will be used to set our cookie
  let new_variant_url=" " // this is used to catch one of the two randomly generated urls

  
  //Defining the ElementHandler class to support HTMLRewriter which will help us to change the contents of the HTML page
  class ElementHandler {
    constructor(attributeName) {
      this.attributeName = attributeName
    }
   
    element(element) {//taking in the element given by HTMLRewriter.on()
      if(element.tagName=="title"){//checking if the element is the title tag of the page
          if(new_variant_url.includes("1")){ //checking if the url string has the character 1 meaning it is of variant 1
            element.setInnerContent("New Variant 1")
            //console.log("inside title and 1")
          }
          else{
            element.setInnerContent("New Variant 2") //else it is of variant 2
            //console.log("inside title and 2")
          }
      }
      if(element.tagName=="h1"){//checking if the element is the h1 tag of the page
          if(new_variant_url.includes("1")){//checking if the url string has the character 1 meaning it is of variant 1
            element.setInnerContent("This is New Variant 1") //this will change the inner content of the element h1 which is "Variant 1"
            //console.log("inside h1 and 1")
          }
          else{
            (element).setInnerContent("This is New Variant 2")//else it is of variant 2
            //console.log("inside h1 and 2")}
          }
      }
      if(element.tagName=="a"){
          element.setInnerContent("My Github profile") //changing the text of the a tag
          const attribute = element.getAttribute(this.attributeName)//getting the attribute name href of tag a
            element.setAttribute(this.attributeName,
              attribute.replace("https://cloudflare.com", 'https://github.com/rohitvish30') // redirecting to my github link by replacing the already given link
            ) 
      }
      if(element.tagName=="p"){//changing the paragraph contents
          element.setInnerContent("Cloudflare's worker is one of the best tool that I have ever worked with!")
      }
    }
  }

  
// HTMLRewriter class initialization
const writeNew = new HTMLRewriter()
                .on('title', new ElementHandler()) // The main heading of the page is given by title tag
                .on('h1', new ElementHandler()) // the header of the page i.e. "Variant 1 or 2" is given by h1#title tag
                .on('p', new ElementHandler()) // the descitption of the page is given by p element tag
                .on('a', new ElementHandler("href")) // the link to www.cloudflare.com is given by the href attribute of the a element tag
                
  

const URL="https://cfw-takehome.developers.workers.dev/api/variants" //this is the given url


// returning the fetch result of the given URL //
const fetchResult = () => { 
  return fetch(URL) 
}


// Choosing any one url with equal probabilities and returning its fetch result//
const fetchRandomVariant = (array) => {
  var a=Math.round((Math.random())) // Math.random() generates float values ranging between 0 and 1 with equal probabilities and Math.round() will round it to nearest integer 0 or 1
  return fetch((array.variants[a])); // when fetch is used we are getting one specific URL and all Metadata related to that particular URL
  };

  
  
  async function handleRequest(request) {
    const cookie = request.headers.get('cookie') //Reading the entire cookie
    let oldURL=null 
    if (cookie) { //if cookie is present continue
      let cookies = cookie.split(';') //split the different cookie key value contents string by ; 
      cookies.forEach(c => { //for each key value string
        let cookieName = c.split('=')[0].trim() //split with key string and value string by = and taking key string in the variable
        if (cookieName === NAME) {//if the key string==temp is found then continue
          oldURL = c.split('=')[1] //reading the value string of the temp i.e. url string and appending it to our globalvariable of oldURL
          //console.log("got cookie")
        }
      })
   }
    //Checking oldURL - if it is not null then pass the oldURL to the HTMLRewriter and return the transformed response.
    if(oldURL){
      new_variant_url=oldURL
      res = await fetch(oldURL) 
      //console.log("Got old Url")
      return writeNew.transform(res)
    }
    else{
      //console.log("No cookie found")
      const apiResponse = await fetchResult() // await - will wait untill fetchResult() gives the output
      const finalresponse=await apiResponse.json() // converting the result of apiresponse to JSON and passing it to finalresponse variable
      let selectedRandomUrl= await fetchRandomVariant(finalresponse) // passing the finalresponse variable to the function generateRandomUrl to generate from one of the two urls given
      new_variant_url = selectedRandomUrl.url //Selecting the value of the url 
      let response=new Response() //creating a new response to append our fetched response and to set cookies in header
      res = await fetch(new_variant_url) //fetching the new variant url
      //console.log("New Url")
      response=writeNew.transform(res) //finally transforming the fetched variant url through the HTMLRewriter
      response.headers.append('Set-Cookie', `${NAME}=${new_variant_url};path=/`) //Setting the cookie
      return response // returning the response with cookies set
    }    
        
  }
    


  






