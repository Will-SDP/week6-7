


function addCard(title, image, text, id) {
    const cardHtml = `
        <div class="col-sm-6 col-lg-4 mt-4">
            <div class="card h-100">
                <img class="card-img-top" src="${image}" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h4 class="card-title">${title}</h4>
                    <p class="card-text">${text}</p>
                    <a href="#" data-id="${id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#moreModal">See Profile</a>
                </div>
            </div>
        </div>    
    `;
    
    $('#content').append(cardHtml);
}

function loadData(data){
    for (let i = 0; i < data.length; i++) {
        addCard(data[i].name, data[i].image.url , data[i].temperament, data[i].id)
      }
}

function pagination(element, page){
    $(".page-item").removeClass("active")
    element.classList.add("active")
    getData(page)
}

function addAlert(type, message) {
    const alertHtml = `
        <div class="alert alert-${type}">
            <strong>${message}</strong>
        </div>  
    `;
    
    $('#content').append(alertHtml);
}



async function getData(page="1", query='') {
    $('#content').empty()
    const url = `https://api.freeapi.app/api/v1/public/dogs?page=${page}&limit=25&query=${query}`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    let result = await fetch(url, options);
    let data = await result.json();

    if(data['data']['totalItems'] === 0){
        addAlert("warning", "No result found")
    } else {
        msg = `Showing ${data['data']['currentPageItems']} of ${data['data']['totalItems']} ressults`
        addAlert("success", msg)
        loadData(data['data']['data'])
    }
}

async function getDog(id) {
    const url = `https://api.freeapi.app/api/v1/public/dogs/${id}`;
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    let result = await fetch(url, options);
    let data = await result.json();
    const dog = data.data
    $(".modal-title").text(`${dog.name} (${dog.breed_group})`)
    $("#modal-img").attr("src", dog.image.url);
    $("#temperament").text(dog.temperament)
    $("#weight").text(dog.weight.metric)
    $("#height").text(dog.height.metric)
    $("#bred_for").text(dog.bred_for)
    $("#life_span").text(dog.life_span)
}

$('#moreModal').on('shown.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var id = button.data('id') 
    getDog(id)
  })

$(document).ready(function(){
    getData()
    $("#search").click(function(){        
        getData(1, $("#query").val())
    })
})