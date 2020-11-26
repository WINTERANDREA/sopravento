/* Variabili */
let id_product_catalog = "334489137289664";
let access_token = "EAAU6oAzul1YBAFOyDV8B9uLQZC6raZBu0v50oi9WZBX3dGL6ECzW6p6UBa1Lo8Drd9gsvoNNghI2C5q2svzuEHNcy7SxZACmvGPGhgxBy5z9EsGhl9jqRaF77sCtMkacsx1xtscZCciTZCUZCxpiWORESZCe7F0abadkrxJUZBrQCZACRa2qqvVa4x";

var products_published = []
var count_product;



/* GET POSTS ID */
async function get_posts(){
  const response = await fetch(`https://graph.facebook.com/${id_product_catalog}/products?fields=name,price,product_catalog,url,product_group,image_cdn_urls,id,description,visibility,additional_image_cdn_urls&access_token=${access_token}`)
  const data = await response.json();
  catalog = data.data
  catalog.forEach(product => {
    if(product["visibility"] == "published"){
        products_published.push(product)
      } else {
        //pass
      }
  })
  count_product= products_published.length
  return products_published
}

get_posts()
.then( data => {
     var p_number = 1;
    data.forEach(element => {
      //Create HTML template for each product
      const ProductBlock = `<div class="ProductBlock">
            <div class="Content">
              <div class="fb_post_card" id="post_${p_number}">
                <div class="fb_header d-flex w-100 align-items-center ">
                  <img class="fb_icona_365 mt-1 mr-2" src="img/sopravento_logo.png" alt="assistenza365_logo" />
                  <div class="fb_from_container d-flex flex-column " id="fb_from_${p_number}">
                    <span style="font-weight: 400;">Sopravento srl</span>
                  </div>
                  <img class="fb_icona" src="./img/fb_icon.png" alt="fb_icona" />
                </div>
                <div class="fb_img img-fluid" id="fb_img_${p_number}"></div>
                <div class="fb_name" id="fb_name_${p_number}">
                </div>
                <div class="fb_message" id="fb_message_${p_number}">
                </div>
                <div id="fb_more_${p_number}" class="fb_more">
                </div>
              </div>
            </div>
          </div>`
      document.querySelector('#p_container').insertAdjacentHTML('afterbegin', ProductBlock);
      
      //Insert product data
      var p_state = document.getElementById("post_" + p_number)
      var p_image = document.getElementById("fb_img_" + p_number)
      var p_name = document.getElementById("fb_name_" + p_number)
      var p_message = document.getElementById("fb_message_" + p_number)  
      var p_more = document.getElementById("fb_more_" + p_number)
      p_state.setAttribute("fb-xfbml-state",true)
      p_image.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 170, 248,.2) 2%, rgba(0, 170, 248,.1)), url(${element["image_cdn_urls"][1]?.value})`
      p_name.insertAdjacentHTML("afterbegin", `<p>${element.name}</p>`)
      p_message.insertAdjacentHTML("afterbegin", `<p>${element.description}</p>`)
      p_more.insertAdjacentHTML("afterbegin", `<a target="_blank" href="https://www.facebook.com/commerce/products/${element.id}?ref=mini_shop_storefront&referral_code=mini_shop_page_card_cta">Visita lo shop di Facebook</a>`)
      
      
      p_number += 1;
  })
   FB.XFBML.parse();
 })

 
/* INITIALIZE CAROUSEL */
window.onload = function(){
  FB.Event.subscribe('xfbml.render', function(response) {
    let renders = document.querySelectorAll("[fb-xfbml-state]");
    if (renders.length == count_product){
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
  
