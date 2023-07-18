

window.addEventListener('load',function(){

    init()
})

const apiKey = "acf347697bcf4c77f3a955687b30d605";
const baseUrl = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";


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
    fetchSearchQuery: (id_search)=> `${baseUrl}/search/movie?query=${id_search}&api_key=${apiKey}`,
    fetchTrending: `${baseUrl}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchAddToWatchListMovies: (movie_id_parent)=> `${baseUrl}/movie/${movie_id_parent}?api_key=${apiKey}`
}




function init(){
    
   fetchandBuildAllSections();
   fetchAndBuildTrending();
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
    const containerBanner = document.getElementById('home_back_img')
    containerBanner.style.backgroundImage= `url('${imgPath}${movie.backdrop_path}')`

    const div = document.createElement('div')
    div.innerHTML=`

    <div class="home-overlay-abs"></div>
    <div class="home-back-abs">
        <div class="home-slider-title">${movie.title}</div>
        <div class="home-slider-desc">${movie.overview}</div>
        <div class="home-slider-btns-2">
            <div class="watch-btn">Watch Now</div>
            <div class="watchlist-btn">Add to Watchlist</div>
        </div>
    </div>
    `

    containerBanner.append(div)
}

 function fetchandBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
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

 function fetchAndBuildMovieSection(fetchMovieUrl,genreName){
   return  fetch(fetchMovieUrl)
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
function storeMovieId(movieId) {
    var movieid = movieId;

    console.log(movieId_array.includes(movieId));
    

if(!movieId_array.includes(movieId)){

    movieId_array.push(movieId);
    console.log(movieId_array);
  
    // Fetch movie details from the API
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
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
                                             <div class="watch-btn red-btn">Watch
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
  
        // Initialize the Slick Carousel if it hasn't been initialized yet
        if (!$(".my-list-carousel").hasClass("slick-initialized")) {
          $(".my-list-carousel").slick({
            slidesToShow: 4,
            slidesToScroll: 2.5,
            responsive: [
              {
                breakpoint: 850,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 2.5,
                  infinite: true
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
     else{

        const index = movieId_array.indexOf(movieId);
        movieId_array.splice(index,1);
        // console.log("movieid in else :"+movieId_array)
        const Item = "movieId"+movieId;
        // console.log("item:"+Item)
        const displayNoneItem = document.querySelector(`.movieId${movieId}`);
        displayNoneItem.setAttribute("style","display:none;");
        displayNoneItem.classList.remove("slick-active");

        var $indexid = $(`.movieId${movieId}`).attr("data-slick-index");
        $('.my-list-carousel').slick('slickRemove', $indexid);
       

        
        // console.log(displayNoneItem.classList)
        

     }
     const my_list_h1 = document.querySelector(".my-list-h1");
    if(movieId_array.length===0){
        my_list_h1.setAttribute("style","display:none;");
    }
    else{
        my_list_h1.setAttribute("style","display:unset;")
    }
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
                                <h2>${movie.title}</h2>
                                    <div class="home-slider-btns-2">
                                        <div class="watch-btn red-btn">Watch
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


    
    container.on("click", ".ticks", function () {
        $(this).toggleClass("clicked");
      })


    container.find('.test').slick({
        slidesToShow: 4,
        slidesToScroll: 2.5,
        // autoplay: true,
        // autoplaySpeed: 1500,
        responsive: [{
            breakpoint: 850,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2.5,
                infinite: true
            }
        }]
    });
    
}









   
   
  






// Get necessary elements
