/* var xhttp = new XMLHttpRequest();
xhttp.open(
  "GET",
  "https://graph.facebook.com/v9.0/334489137289664/products?fields=name,price,product_catalog,url,product_group,image_cdn_urls,id,description,visibility,additional_image_cdn_urls&access_token=EAAKMPZC8BoZAUBAFxydNXkbKy7IsuiZB6ZBcUMvUQFhboYpmw8G4pVLGUr8dQqedZCZCRNJ6sAB69Dj3gK1dxJdZAyx94z60bDf2ZBTcMQ7oZCfg6OtOQRJ8INpcW3qS0EIZC8uB91N3bcwZAvADZACDvDt0Msk2Ww30DEKYCGtAxgsBMgZDZD"
);

xhttp.onload = () => {
  console.log(xhttp);
  if (xhttp.status == 200) {
    console.log(JSON.parse(xhttp.response));
  } else {
    console.log(`error ${xhttp.status} ${xhttp.statusText}`);
  }
};
xhttp.send();
 */

 /* Variabili */
let id_product_catalog = "334489137289664";
let access_token = "EAAKMPZC8BoZAUBAFxydNXkbKy7IsuiZB6ZBcUMvUQFhboYpmw8G4pVLGUr8dQqedZCZCRNJ6sAB69Dj3gK1dxJdZAyx94z60bDf2ZBTcMQ7oZCfg6OtOQRJ8INpcW3qS0EIZC8uB91N3bcwZAvADZACDvDt0Msk2Ww30DEKYCGtAxgsBMgZDZD";
var n_post_to_show = 5;
var count_post;



/* GET POSTS ID */
async function get_posts(){
  const response = await fetch(`https://graph.facebook.com/${id_product_catalog}/products?fields=name,price,product_catalog,url,product_group,image_cdn_urls,id,description,visibility,additional_image_cdn_urls&access_token=${access_token}`)
  const posts = await response.json();
  const last_posts = posts.data.splice(0,n_post_to_show);
  count_post = last_posts.length
  return last_posts
}

/* GET POST DATA */
async function create_post(post_id){
  const response = await fetch(`https://graph.facebook.com/${post_id}/?fields=message,created_time,full_picture,icon,actions,from&access_token=${access_token}`)
  const post = await response.json();
  return post  
}

/* CREATE POST */
get_posts()
.then(data => {
  let promises =[];
  for (const single_post of data) {
    promises.push(create_post(single_post["id"]))
  }
  return promises
})
.then(data => {
  var post_number = 1;
  
  Promise.all(data).then(data => {
    console.log(data)
    data.forEach(element => {
      var post_state = document.getElementById("post_" + post_number)
      var message = document.getElementById("fb_message_" + post_number)
      var image = document.getElementById("fb_img_" + post_number)
      var from = document.getElementById("fb_from_" + post_number)
      var fb_more = document.getElementById("fb_more_" + post_number)
      var fb_like = document.getElementById("fb_like_" + post_number)
      var fb_comment = document.getElementById("fb_comment_" + post_number)
      var fb_share = document.getElementById("fb_share_" + post_number)
      message.insertAdjacentHTML("afterbegin", `<p>${element.message}</p>`)
      fb_more.insertAdjacentHTML("afterbegin", `<a target="_blank" href="${element.actions[0]["link"]}">...Leggi di più</a>`)
      fb_like.insertAdjacentHTML("beforeend", `<a  target="_blank" href="${element.actions[0]["link"]}">Like</a>`)
      fb_comment.insertAdjacentHTML("beforeend", `<a  target="_blank" href="${element.actions[1]["link"]}">Comment</a>`)
      fb_share.insertAdjacentHTML("beforeend", `<a  target="_blank" href="${element.actions[2]["link"]}">Share</a>`)
      image.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,.6) 2%, rgba(0,0,0,.1)), url(${element.full_picture})`
      from.insertAdjacentHTML("afterbegin", `<a>${element.from["name"]}</a>`)
      var date = new Date(element.created_time)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      from.insertAdjacentHTML("beforeend", `<a class="post_data">${date.toLocaleDateString('it-IT', options)}</a>`)
      post_state.setAttribute("fb-xfbml-state",true)
      post_number += 1;
    })
    FB.XFBML.parse();
  })
}).catch(e => {
  console.log(e)
})


/* INITIALIZE CAROUSEL */
window.onload = function(){
  FB.Event.subscribe('xfbml.render', function(response) {
    console.log(response)
    let renders = document.querySelectorAll("[fb-xfbml-state]");
     console.log(renders)
    if (renders.length == count_post){
      $(".SlickCarousel").slick({
    rtl:false, // If RTL Make it true & .slick-slide{float:right;}
    autoplay:true, 
    autoplaySpeed:4000, //  Slide Delay
    speed:1500, // Transition Speed
    slidesToShow:4, // Number Of Carousel
    slidesToScroll:1, // Slide To Move 
    pauseOnHover:false,
    appendArrows:$(".Carosello .Head .Arrows"), // Class For Arrows Buttons
    prevArrow:'<span class="Slick-Prev"></span>',
    nextArrow:'<span class="Slick-Next"></span>',
    easing:"linear",
    responsive:[
      {breakpoint:1650,settings:{
        slidesToShow:3,
      }},
      {breakpoint:1200,settings:{
        slidesToShow:2,
      }},
      {breakpoint:920,settings:{
        slidesToShow:1,
      }}
    ],
  })
  $("#loader_container").remove()
  } 
  })
}