

window.addEventListener('load',function(){
    init()
})

const apiKey = "acf347697bcf4c77f3a955687b30d605";
const baseUrl = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeApiKey = "AIzaSyCj6jfBamh3bvKee-Lg-nA1Du7B_K5uPmY"
var bannerBtn=false;


const fighure = document.querySelectorAll(".cont");
 const trans_card = document.querySelectorAll(".trans-card")
 
 
 fighure.forEach(fighure => {
   fighure.addEventListener('click', function handleClick(event) {
     console.log('box clicked', event);
 
     const trans_card = fighure.querySelector(".trans-card");
     trans_card.setAttribute('style', 'transform: translateY(86px)')
   });
 });


const apiPaths = {
    fetchAllCategories: `${baseUrl}/genre/movie/list?api_key=${apiKey}`,
    fetchMovies: (id)=> `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${baseUrl}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchYoutubeTraler: (searchQuery)=> `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${youtubeApiKey}`
}




function init(){
    
   fetchandBuildAllSections();
   fetchAndBuildTrending();
   allMoviesFetch();
}

function fetchAndBuildTrending(){
    fetchAndBuildMovieSection(apiPaths.fetchTrending,'Trending Now')
    .then(list =>{
        const randomNum = parseInt(Math.random() * list.length)
        buildBannerBackgroundSection(list[randomNum]);
    })
    .catch(err=>{
        console.error(err);
    })
}

function buildBannerBackgroundSection(movie){
    const container = document.querySelector(".home-background-cont");
    const containerBanner = document.getElementById('home_back_img')
    containerBanner.style.backgroundImage= `url('${imgPath}${movie.backdrop_path}')`

    const div = document.createElement('div')
    div.innerHTML=`

    <div class="home-overlay-abs"></div>
    <div class="home-back-abs">
        <div class="home-slider-title">${movie.original_title}</div>
        <div class="home-slider-desc">${movie.overview}</div>
        <div class="home-slider-btns-2">
            <div onclick="fetchYoutubeTrailer('${movie.title}',${movie.id})" class="watch-btn">Play</div>
                <div class="ticks" onclick="storeMovieId(${movie.id})">
                    <div class="tick-1"></div>
                    <div class="tick-2"></div>                      
                </div>
        </div>
    </div>
    `
    


    containerBanner.append(div)

    const containerBanner_back= document.querySelector(".home-slider");
    const ticks = containerBanner_back.querySelector(".ticks");
    ticks.addEventListener("click",function(){
        ticks.classList.toggle("clicked");
    })
   
    
}


async function fetchandBuildAllSections(){
   await fetch(apiPaths.fetchAllCategories)
    .then(res=> res.json())
    .then(res=>{
        const genres = res.genres;
        if(Array.isArray(genres) && genres.length){
            genres.forEach(genre =>{
                fetchAndBuildMovieSection(apiPaths.fetchMovies(genre.id),genre.name)
            })
        }
    })
}

async function fetchAndBuildMovieSection(fetchMovieUrl,genreName){
   return await fetch(fetchMovieUrl)
    .then(res=> res.json())
    .then(res=>{
        const movies= res.results;
        if(Array.isArray(movies) && movies.length){
           
                buildMoviesSection(movies,genreName)
            
        }
        return movies;
    })

}



var movieId_array =[];
async function storeMovieId(movieId) {
    var movieid = movieId;

    console.log("movieid present:"+movieId_array.includes(movieId));
    console.log("before :"+movieId_array);
    

if(!movieId_array.includes(movieId)){

    movieId_array.push(movieId);
    console.log("after :"+movieId_array);
  
    // Fetch movie details from the API
  await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then(res => res.json())
      .then(movie => {
        console.log(movie);
  
        // Create the HTML structure for the movie
        const movieHTML = `
        <div class="cont movieId${movie.id}">
                     <figure class="testimonial">
                        <blockquote>
                             <img class="imgWidth" src="${imgPath}${movie.backdrop_path}" alt="" srcset="">
                             <div class="trans-card">
                                     <h2>${movie.title}</h2>
                                         <div class="home-slider-btns-2">
                                             <div onclick="fetchYoutubeTrailer('${movie.title}',${movie.id})" class="watch-btn red-btn">
                                             <img class="imgWidth_watch_btn" src="./images/play2.jpeg" alt="" srcset="">
                                         </div>
                                        
                                             <div class="ticks clicked" onclick="storeMovieId(${movie.id})">
                                                 <div class="tick-1"></div>
                                                 <div class="tick-2"></div>
                                                
                                         </div>
        
                                    </div>   
                                </div>
                         </blockquote>
                     </figure>
                 </div>
        `;
  
        // Initialize the Slick Carousel if it hasn't been initialized yet
        if (!$(".my-list-carousel").hasClass("slick-initialized")) {
          $(".my-list-carousel").slick({
            slidesToShow: 5,
            slidesToScroll: 2.5,
            infinite: false,
            responsive: [
              {
                breakpoint: 850,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 2,
                  infinite: false
                }
              }
            ]
          });
        }
  
        // Add the movie to the Slick Carousel
        $(".my-list-carousel").slick("slickAdd", movieHTML);
  
        // Update the button text or style to indicate that the movie has been added
        
      })
      .catch(error => {
        console.error(error);
      });
    }
     else if(movieId_array.includes(movieId)){

        const index = movieId_array.indexOf(movieId);
        movieId_array.splice(index,1);
        console.log("movieid in else :"+movieId_array)
        const Item = "movieId"+movieId;
        // console.log("item:"+Item)
        const displayNoneItem = document.querySelector(`.movieId${movieId}`);
        displayNoneItem.setAttribute("style","display:none;");
        displayNoneItem.classList.remove("slick-active");
        // displayNoneItem.setAttribute("style","display:none;");
        // displayNoneItem.classList.remove(`movieId${movieId}`);

        var $indexid = $(`.movieId${movieId}`).attr("data-slick-index");
        console.log("slick index:"+$indexid);
        $('.my-list-carousel').slick('slickRemove', $indexid);     
     }

     const my_list_h1 = document.querySelector(".my-list-h1");
    if(movieId_array.length===0){
        my_list_h1.setAttribute("style","display:none;");
    }
    else{
        my_list_h1.setAttribute("style","display:unset;")
    }
  }
function searchMovies(){

    const search_body = document.querySelector(".search-body");
    const main = document.querySelector(".main");
    search_body.classList.toggle("search-body-translate");
    main.classList.toggle("main-display-none");
    
  }
  $(document).ready(function(){
    console.log("hello jquery")
    $("#input").on("keyup", function(){
        var value = $(this).val().toLowerCase();
        $("#cards #card").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value)>-1);
        })
    })
})

async function allMoviesFetch(){
    for (let page_no = 1; page_no < 21; page_no++) {
   await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page_no}`)
    .then(res=>res.json())
    .then(res=>{
        var moviess = res.results;
        // console.log(moviess);
        if(Array.isArray(moviess)  && moviess.length){
            
            getmovieId(moviess)
        }
    })
}
}
 function getmovieId(movies){
    
    movies.map(function(movie){
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
        .then(res=>res.json())
        .then(res=>{
            var movie_with_id = res;
            // console.log(movie_with_id)
                searchBodyMoviesdiff(movie_with_id)
            
            
        })
    })
    
}

function searchBodyMoviesdiff(movie){
    const movieContainer = $(".cards_class");
    let genres = movie.genres;
    let production = movie.production_companies;
    let obj = JSON.stringify(genres);
    let prod_obj = JSON.stringify(production);
    

    const movieIMG =  `
        <div class="card_movies" id="card">
                <figure class="testimonial">
                    <blockquote>
                        <img class="imgWidth" src="${imgPath}${movie.backdrop_path}" alt="" srcset="">
                        <div class="trans-card">
                                <h2>${movie.original_title}</h2>
                                <div style="display:none;">${obj}${prod_obj}</div>
                                    <div onclick="fetchYoutubeTrailer('${movie.title}',${movie.id})" class="home-slider-btns-2">
                                        <div class="watch-btn">
                                            <img class="imgWidth_watch_btn" src="./images/play2.jpeg" alt="" srcset="">

                                    </div>
                                    
                                        <div class="ticks" onclick="storeMovieId(${movie.id})">
                                            <div class="tick-1"></div>
                                            <div class="tick-2"></div>
                                            
                                    </div>

                                </div>   
                            </div>
                    </blockquote>
                </figure>
            </div>        
        `;
        // console.log(movieIMG)

    const movieHTML = `
    
    <div>
        ${movieIMG}      
       </div>     
  
    `;

    const container = $("<div>").addClass("search-body-movies").html(movieHTML);

    movieContainer.append(container);

    

    
    container.on("click", ".ticks", function () {
        $(this).toggleClass("clicked");
      })


}

  function searchBodyMovies(movies){
    const movieContainer = $(".search-body");


    const movieIMG = movies.map(function(movie) {
        return `
        <div class="card_movies" id="card">
                <figure class="testimonial">
                    <blockquote>
                        <img class="imgWidth" src="${imgPath}${movie.backdrop_path}" alt="" srcset="">
                        <div class="trans-card">
                                <h2>${movie.original_title}</h2>
                                <div style="display:none;">${movie.genre}${movie.overview}</div>
                                    <div class="home-slider-btns-2">
                                        <div onclick="fetchYoutubeTrailer('${movie.title}',${movie.id})" class="watch-btn">
                                            <img class="imgWidth_watch_btn" src="./images/play2.jpeg" alt="" srcset="">

                                    </div>
                                    
                                        <div class="ticks" onclick="storeMovieId(${movie.id})">
                                            <div class="tick-1"></div>
                                            <div class="tick-2"></div>
                                            
                                    </div>

                                </div>   
                            </div>
                    </blockquote>
                </figure>
            </div>        
        `;
    }).join('');
    console.log(movieIMG)

    const movieHTML = `
    
    <div class="cards_class" id="cards">
        ${movieIMG}      
       </div>     
  
    `;

    const container = $("<div>").addClass("container_2").html(movieHTML);

    movieContainer.append(container);

    

    

    
    container.on("click", ".ticks", function () {
        $(this).toggleClass("clicked");
      })

  }



  function fetchYoutubeTrailer(movieTitle,movieId){

    console.log("entered")
    if(!movieTitle) return;

    fetch(apiPaths.fetchYoutubeTraler(movieTitle))
    .then(res=> res.json())
    .then(res=> {
        var movieTrailer = res.items[0];
        const youtubeTrailerUrl= `https://www.youtube.com/watch?v=${movieTrailer.id.videoId}`
        const videoId = movieTrailer.id.videoId;

        console.log(videoId)
        

       
        
        window.location.href = `youtubeTrailer.html?videoId=${encodeURIComponent(videoId)}&movieId=${encodeURIComponent(movieId)}`

        


    })
}

var movies_list_single;


  
 function buildMoviesSection(movies, genreName) {
    const movieContainer = $(".genre-slider");


    const movieIMG = movies.map(function(movie) {
        return `
        <div class="cont">
                <figure class="testimonial">
                    <blockquote>
                        <img class="imgWidth" src="${imgPath}${movie.backdrop_path}" alt="" srcset="">
                        <div class="trans-card">
                                <h2>${movie.original_title}</h2>
                                    <div class="home-slider-btns-2">
                                        <div onclick="fetchYoutubeTrailer('${movie.title}',${movie.id})" class="watch-btn">
                                            <img class="imgWidth_watch_btn" src="./images/play2.jpeg" alt="" srcset="">

                                    </div>
                                    
                                        <div class="ticks" onclick="storeMovieId(${movie.id})">
                                            <div class="tick-1"></div>
                                            <div class="tick-2"></div>
                                            
                                    </div>

                                </div>   
                            </div>
                    </blockquote>
                </figure>
            </div>        
        `;
    }).join('');

    const movieHTML = `
    <h1>${genreName}</h1>
    <div class="test">
        ${movieIMG}      
       </div>     
  
    `;

    const container = $("<div>").addClass("container_2").html(movieHTML);
    movieContainer.append(container);

    const container_2 = $('.container_2');
    container_2.each(function(i) {
    $(this).css('z-index', container_2.length - i);
    });


    
    container.on("click", ".ticks", function () {
        $(this).toggleClass("clicked");
      })


    container.find('.test').slick({
        slidesToShow: 5,
        slidesToScroll: 2.5,
        // autoplay: true,
        // autoplaySpeed: 1500,
        responsive: [{
            breakpoint: 850,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
                infinite: true
            }
        }]
    });
    
}











   
   
  






// Get necessary elements
