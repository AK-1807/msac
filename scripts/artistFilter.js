
const cardWrapper = document.getElementById("hits")
const paginationWrapper =  document.getElementById("pagination")
const section = document.querySelector(".artist-filter")
const searchBox = document.getElementById("search-box")

const typesOfFilter = document.querySelectorAll("#filter_type li")

var queryParams =  window.location.search


if(queryParams){
    let searchParam = queryParams.split("?page=")[1]
    if(searchParam == "entertainment"){
        filter("entertainment")
        document.querySelector("#districts").closest(".grid").classList.add("forceHidden")
    }else if(searchParam == "artist"){
        filter("db")
    }else if(searchParam == "organizations"){
        filter("db")
        document.querySelector("#art_type").closest(".grid").querySelector("p").innerText = "Type of Organization"
    }else if(searchParam == "presenting-rosters"){
        filter("db")
       
        document.querySelector("#districts").closest(".grid").classList.add("forceHidden")
        document.querySelector("#art_type").closest(".grid").classList.add("forceHidden")
        document.querySelector("#prices").closest(".grid").classList.add("forceHidden")
        document.querySelector("#population_type").closest(".grid").classList.add("forceHidden")
        document.querySelector("#engagement_type").closest(".grid").classList.add("forceHidden")
    }else if(searchParam == "teaching-rosters"){
        filter("db")
        document.querySelector("#districts").closest(".grid").classList.add("forceHidden")
        document.querySelector("#art_type").closest(".grid").classList.add("forceHidden")
        document.querySelector("#prices").closest(".grid").classList.add("forceHidden")
        document.querySelector("#population_type").closest(".grid").classList.add("forceHidden")
        document.querySelector("#engagement_type").closest(".grid").classList.add("forceHidden")
    }
    
    let text = document.querySelector(`li[data-value=${searchParam}]`).querySelector("a").innerText
    document.querySelector("#filter-by").value = text
}else{
    filter("db")
}



function filter(url){

    fetch(`../db/${url}.json`)
    .then(response => response.json())
    .then(responseData => {

        const artistData = responseData.artists

        let sortedData = artistData
        var forSeaching

        var Obj = {
            "fulldata": artistData,
            "page": 1,
            "rows": 9,
            "visibleBtn": 5
        };
        var selectedArtType = []
        var selectedPrice = []
        var selectedDistrict = []
        var selectedPopulation = []
        var selectedCounty = []
        var selectedEngagement = []
        
        printCards(sortedData)
        //print cards
        function printCards(data){
            var output = ""
            cardWrapper.innerHTML = ""
            
        var trimmedData = pagination(data, Obj.page, Obj.rows)

            for (var i = 0; i < (trimmedData.artistsData).length; i++) {
                let artist = trimmedData.artistsData[i]
                
                output += `
                <div class="bg-white rounded-lg shadow-md">
                    <img src="./images/default-img.jpg" alt="Artist Name" width="300" height="200" class="rounded-t-lg object-cover w-full aspect-video">
                    <div class="p-4">
                    <h4 class="text-lg text-[#940100] uppercase font-semibold">${url == "entertainment" ? artist.field_artist_districts : artist.title}</h4>
                    <p class="text-sm text-muted-foreground">${url == "entertainment" ? artist.field_county :artist.field_artist_artistic_categories}</p>
                    ${artist.field_artist_bk_price && artist.field_artist_bk_price != ""  ? (`<p class="text-sm text-muted-foreground">Booking Price: ${artist.field_artist_bk_price }</p>`): ""}
                    </div>
                    <div class="mt-2 flex justify-between items-center p-4">
                    <a class="px-[15px] py-[10px]" href="https://msac.org/directory#/artists">View Profile</a>
                    </div>
                </div>
                `
                cardWrapper.innerHTML = output;
            }
        }

            function pagination(data, page, rows) {
                var trimStart = (page - 1) * rows;
                var trimEnd = trimStart + rows;
                var trimData = data.slice(trimStart, trimEnd);
                var totalPages = Math.ceil(data.length / rows);

                let beforePage = page - 1;
                let afterPage = parseInt(page) + 1;
                let active;
                let liTag = '';

                if (page > 1) {
                    liTag += `<li class="page show-more prev" value="prev"><svg class="rotate-[-90deg]" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12 9.333-4-4-4 4" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg></li>`;
                }
                if (totalPages > 5) {
                    if (page > 2) {
                        liTag += `<li class="page numb" value="1">1</li>`;
                        if (page > 3) {
                            liTag += `<li class="page dots"><span>...</span></li>`;
                        }
                    }
                }

                if (page == totalPages) {
                    beforePage = beforePage - 2;
                } else if (page == totalPages - 1) {
                    beforePage = beforePage - 1;
                }

                if (page == 1) {
                    afterPage = afterPage + 2;
                } else if (page == 2) {
                    afterPage = afterPage + 1;
                }
                if (totalPages < 6) {
                    if (totalPages == 1) {
                        beforePage = 1
                        afterPage = 1
                    }
                    if (totalPages > 1 && totalPages <= 5) {
                        if (page == 1) {
                            beforePage = page
                        } else {
                            beforePage = page - 1
                        }
                        afterPage = totalPages
                    }
                }
                for (var plength = beforePage; plength <= afterPage; plength++) {

                    if (plength > totalPages) {
                        continue;
                    }
                    if (plength == 0) {
                        plength = plength + 1;
                    }
                    if (page == plength) {
                        active = "current";
                    } else { //else leave empty to the active variable
                        active = "";
                    }
                    liTag += `<li class="page numb ${active}" value="${plength}">${plength}</li>`;

                }
                if (totalPages > 5) {
                    if (page < totalPages - 1) {
                        if (page < totalPages - 2) {
                            liTag += `<li class="page dots">...</li>`;
                        }
                        liTag += `<li class="page last numb" value="${totalPages}">${totalPages}</li>`;
                    }
                }
                if (page < (totalPages)) {

                    liTag += `<li class="page show-more next" value="next"><svg class="rotate-[90deg]" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12 9.333-4-4-4 4" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg></li>`;
                }

                paginationWrapper.innerHTML = liTag

                if (totalPages <=1) {
                    paginationWrapper.innerHTML = ""
                }

                pagebtnClickHandler(data);

                return {
                    "artistsData": trimData,
                    "pages": totalPages
                }
            };

            function pagebtnClickHandler(data) {
                paginationWrapper.querySelectorAll("li").forEach(function (single) {
                    single.addEventListener("click", () => {
                        var pgvalue = single.getAttribute("value")
                        if (pgvalue == "prev") {
                            Obj.page = (parseInt(Obj.page) - 1)
                        } else if (pgvalue == "next") {
                            Obj.page = (parseInt(Obj.page) + 1)
                        } else {
                            Obj.page = pgvalue
                        }

                        paginationWrapper.innerHTML = ""
                        let dataBundle = data == undefined ? artistData : data
                        printCards(dataBundle)
                        var top = section.getBoundingClientRect().top
                        document.documentElement.scrollTop +=top;
                    });
                })
            }

            // ------------- search Functionality -----------

            function searchFilter(dataforSearch) {
                var typedVal;
                var searchedData;
                let dataForSearching
                searchBox.oninput = function () {
                    Obj.page = 1
                    if(selectedArtType.length == 0 && selectedPrice.length == 0 && selectedDistrict.length == 0 && selectedPopulation.length == 0 && selectedCounty.length == 0 && selectedEngagement.length == 0 ){
                        dataForSearching = artistData
                    }else{
                        dataForSearching = dataforSearch
                    }
                    typedVal = this.value.toLowerCase();
                    searchedData = dataForSearching.filter(function (currentValue) {
                        return (currentValue.title).toLowerCase().includes(typedVal)
                    })
                    // sortedData= removeDuplicate(searchedData)
                    sortedData= searchedData

                    if (typedVal !== '') {
                        if (searchedData.length == 0) {
                            cardWrapper.innerHTML = ` <h4>No result found for "${typedVal}"</h4>`
                            paginationWrapper.innerHTML = ''
                            printAllList(sortedData)
                            
                        } else {
                            printCards(sortedData)
                            printAllList(sortedData)
                            forSeaching= sortedData
                        }
                    } else {
                        printCards(dataForSearching)
                        printAllList(dataForSearching)
                        forSeaching =  dataForSearching
                    }

                }
            }
            searchFilter(sortedData)

            //-------list printing-------------

            

            function getFacetValuesArray(nameOfList, data){
                
                let listValuesArray = []
                const regex = /,(?![^()]*\))/g;
                if( nameOfList == 'field_artist_bk_price'){
                    data.map((item) => {
                        if (item.hasOwnProperty(nameOfList)) {
                            if (item[nameOfList]) {
                            let splitVal = item[nameOfList]
                                if (listValuesArray.indexOf(splitVal) === -1) {
                                    listValuesArray.push(splitVal)
                                }
                            }
                        } else {
                            console.log('ns');
                        }
        
                    })
                }else{
                    data.map((item) => {
                        if (item.hasOwnProperty(nameOfList)) {
                            if (item[nameOfList]) {
                                let arrOfValues = item[nameOfList].split(regex)
        
                                arrOfValues.map(splitVal => {
                                    splitVal = splitVal.trim()
                                        if (listValuesArray.indexOf(splitVal) === -1) {
                                            listValuesArray.push(splitVal)
                                        }
                                })
                            }
                        }
        
                    })
                }
            
                return listValuesArray
            }

        function printCheckboxHtml(wrapper, listitemsArray){
                let alreadyCheckedValues = removeUncheckedBoxListItem(wrapper)
                wrapper.innerHTML =""
                let listHtml = ""
                let listWrapperParent = wrapper.parentNode.parentNode
                if(listitemsArray.length == 0){
                    listWrapperParent.style.display ="none"
                }else{
                    listWrapperParent.style.display ="grid";

                    for(let item of listitemsArray){
                        listHtml += '<li><div class="checkbox-row">' +
                        '<a class="type-link">.</a>'+
                        '<div class="check-box-wrap">' +
                        '<input class="blue-checkbox" '+((decodeHtmlEntities(alreadyCheckedValues)).includes(decodeHtmlEntities(item)) ? "checked" : "") +' type="checkbox" name="" id="' + item + '" value="' + item + '">' +
                        '<label for="' + item + '" value="' + item + '">.</label>' +
                        '</div>' +
                        '<div class="text-with-num">' +
                        '<span class="" value="' + item + '">' + item.replaceAll("_"," ") + '</span>' +
                        '</div>' +
                        '</div></li>'
                    
                    }
                    wrapper.innerHTML = (listHtml)
                    
                }

            }

            function setFilterTypeName (key){
                switch (key) {
                    case "location": 
                        return "field_county";
                    case "art_type":
                        return "field_artist_artistic_categories";   
                    case "prices":
                        return "field_artist_bk_price";
                    case "districts":
                        return "field_artist_districts";
                    case "population_type":
                        return "field_artist_population_types";
                    case "engagement_type":
                        return "engagement_type";
                    default:
                        break;
                }
            }
            function printAllList(data,excludedFacet){
                let ulWraps = document.querySelectorAll(".filter-wrap ul");
                let allFilterWraps = (excludedFacet== undefined ? (ulWraps ) : (Array.from(ulWraps).filter(ul => ul.id != excludedFacet)))
                // console.log(allFilterWraps)
                allFilterWraps.forEach((filterListWrap)=>{
                    let id = filterListWrap.getAttribute("id")
                    if(id){
                        if(id != "engagement_type"){
                            let setPropertyName =setFilterTypeName(id)
                            let facetValuesArray = getFacetValuesArray(setPropertyName, data)
                            printCheckboxHtml(filterListWrap , facetValuesArray)
                        }else{
                            let facetValuesArray = getEngagementTypeValArray(data)
                            printCheckboxHtml(filterListWrap , facetValuesArray)
                        }
                    }
                })
              
            }printAllList(artistData)

            function singleList(data,id){
                let filterListWrap = document.querySelector(`#${id}`);
                if(id){
                    if(id != "engagement_type"){
                        let setPropertyName =setFilterTypeName(id)
                        let facetValuesArray = getFacetValuesArray(setPropertyName, data)
                        printCheckboxHtml(filterListWrap , facetValuesArray)
                    }else{
                        let facetValuesArray = getEngagementTypeValArray(data)
                        printCheckboxHtml(filterListWrap , facetValuesArray)
                    }
                }
            }

            //---- print engagement type

            function getEngagementTypeValArray(data){
                const findKeysByValue = (objects, targetValue) => {
                    const result = [];
                    for (let obj of objects) {
                        for (let key in obj) {
                            if (obj[key] == targetValue) {
                            result.push(key);
                            }
                        }
                    }
                    return result;
                };
                return findKeysByValue(data, "1");
            }

            /* 
            functionality
            
            */


            function documentClickHandler(){
                document.addEventListener("click",(e)=>{
                    if(e.target.className == "type-link"){
                        listItemsClickHandler(e.target)
                    }
                    if(e.target.className == "selected-val-wrap"){
                        
                        selectedValClickHandler(e.target)
                    }
                })
              }documentClickHandler()
            

            function selectedValClickHandler(clickedItem){
                var checkBoxes = document.querySelectorAll(".filter-wrap input")
                let selectedvalue = (clickedItem.parentNode).querySelector(".val").getAttribute("value")
                checkBoxes.forEach((box)=>{
                    if(box.value == selectedvalue){
                        let anchorOfThisInput = box.closest(".checkbox-row").querySelector(".type-link")
                
                        listItemsClickHandler(anchorOfThisInput)
                    }
                })

            }

            //li click handler --   
            function listItemsClickHandler(clickedListItem){
               
                Obj.page = 1
                let dataForFacets =  searchBox.value =="" ? artistData : forSeaching
                let parentListWrapId = clickedListItem.closest('ul').getAttribute("id")
                let idRelatedField = setFilterTypeName(parentListWrapId)
                let checkBox = clickedListItem.closest('.checkbox-row').querySelector("input")
                let checboxValue = checkBox.value
                    let checkboxStatus = ""
                if(checkBox.checked){
                    checkBox.checked = false;
                    checkboxStatus = "false"
                }else{
                    checkBox.checked = true;
                    checkboxStatus = "true"
                }

                pushPopSelectedValuesAndFilter(idRelatedField, checboxValue, checkboxStatus, parentListWrapId, dataForFacets)

            }

            function pushPopSelectedValuesAndFilter(idRelatedField, checboxValue, checkboxStatus, ulId, dataForFacets){
            
                if(idRelatedField == "field_artist_artistic_categories"){
                    checkboxStatus == "true" ? selectedArtType.push(checboxValue) : selectedArtType.splice((selectedArtType.indexOf(checboxValue)), 1);
                    filterFunctionalityArtType(selectedArtType, "field_artist_artistic_categories", ulId, dataForFacets)

                }else if(idRelatedField == "field_county"){
                    checkboxStatus == "true" ? selectedCounty.push(checboxValue) : selectedCounty.splice((selectedCounty.indexOf(checboxValue)), 1);
                    filterFunctionalityLocation(selectedCounty, "field_county", ulId, dataForFacets)
                }
                else if(idRelatedField == "field_artist_population_types"){
                    checkboxStatus == "true" ? selectedPopulation.push(checboxValue) : selectedPopulation.splice((selectedPopulation.indexOf(checboxValue)), 1);
                    filterFunctionalityPopulationType(selectedPopulation,"field_artist_population_types",ulId, dataForFacets)
                }
                else if(idRelatedField == "field_artist_districts"){
                    checkboxStatus == "true" ? selectedDistrict.push(checboxValue) : selectedDistrict.splice((selectedDistrict.indexOf(checboxValue)), 1);
                    filterFunctionalityDistrictType(selectedDistrict, "field_artist_districts",ulId, dataForFacets)
                }
                else if(idRelatedField == "field_artist_bk_price"){
                    checkboxStatus == "true" ? selectedPrice.push(checboxValue) : selectedPrice.splice((selectedPrice.indexOf(checboxValue)), 1);
                    filterFunctionalityBookingType(selectedPrice, "field_artist_bk_price",ulId, dataForFacets)

                }else if(idRelatedField == "field_artist_bk_price"){
                    checkboxStatus == "true" ? selectedPrice.push(checboxValue) : selectedPrice.splice((selectedPrice.indexOf(checboxValue)), 1);
                    filterFunctionalityBookingType(selectedPrice, "field_artist_bk_price",ulId, dataForFacets)

                }else if(idRelatedField == "engagement_type"){
                    checkboxStatus == "true" ? selectedEngagement.push(checboxValue) : selectedEngagement.splice((selectedEngagement.indexOf(checboxValue)), 1);
                    filterFunctionalityEngagementType(selectedEngagement, "engagement_type",ulId, dataForFacets)
                }


                printSelectedValues(idRelatedField)
            }

            //check which filter is not empty only 1 
            function checkEmpty(){
               let count= 0;
               let nonnEmpty

               if(selectedArtType.length !=0){
                count +=1
                nonnEmpty ="art_type"
               }
               if(selectedCounty.length !=0){
                count +=1
                nonnEmpty ="location"
               }
               if(selectedDistrict.length !=0){
                count +=1
                nonnEmpty ="districts"
               }
               if(selectedEngagement.length != 0){
                count +=1
                nonnEmpty ="engagement_type"
               }
               if(selectedPopulation.length !=0){
                count +=1
                nonnEmpty ="population_type"
               }
               if(selectedPrice.length !=0){
                count +=1
                nonnEmpty ="prices"
               }

               if(count == 1){
                return nonnEmpty;
               }

            } 

            
            //---art_type facet functionality
            function filterFunctionalityArtType(selectedFacetType, idRelatedField, ulId, dataForFacetFilter){
                let filteredData
                
                //-----art_type
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, dataForFacetFilter, "field_artist_artistic_categories")
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----bookinng_price
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, filteredData, "field_artist_bk_price")
                
                }
                //-----a&e_district
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, filteredData, "field_artist_districts")
                }
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, filteredData, "field_county")
                
                }
                //-----population_type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, filteredData, "field_artist_population_types")
                }
                //-----engagemennt_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, filteredData)
                }
                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)
                
                if(selectedArtType.length == 0 && (selectedCounty.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }

                } else if(selectedArtType.length != 0 && (selectedCounty.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else{ 
                    printAllList(dataWithoutDuplicacy,ulId)
                }

                searchFilter(dataWithoutDuplicacy)
            }

            //---county facet functionality
            function filterFunctionalityLocation(selectedFacetType, idRelatedField,ulId, dataForFacetFilter){
                let filteredData
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, dataForFacetFilter, "field_county")
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----art_type
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, filteredData, "field_artist_artistic_categories")
                }
                //-----bookinng_price
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, filteredData, "field_artist_bk_price")
                }
                //-----a&e_district
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, filteredData, "field_artist_districts")
                }
                
                //-----population_type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, filteredData, "field_artist_population_types")
                }
                //-----engagemennt_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, filteredData)
                }

                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)
                
                if(selectedCounty.length == 0 && (selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }
                }else if(selectedCounty.length != 0 && (selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else {
                    printAllList(dataWithoutDuplicacy,ulId)
                }

                searchFilter(dataWithoutDuplicacy)
            }

            //---booking_price facet functionality
            function filterFunctionalityBookingType(selectedFacetType, idRelatedField, ulId, dataForFacetFilter){
                let filteredData

                //-----art_type
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, dataForFacetFilter, "field_artist_bk_price")
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----bookinng_price
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, filteredData, "field_artist_artistic_categories")
                }
                
                //-----a&e_district
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, filteredData, "field_artist_districts")
                }
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, filteredData, "field_county")
                }
                //-----population_type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, filteredData, "field_artist_population_types")
                }
                //-----engagemennt_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, filteredData)
                }

                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)

                if(selectedPrice.length == 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }
                } else if(selectedPrice.length != 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else{
                    printAllList(dataWithoutDuplicacy, ulId)
                }
                searchFilter(dataWithoutDuplicacy,ulId)
            }

            //---a&e_districts facet functionality
            function filterFunctionalityDistrictType(selectedFacetType, idRelatedField, ulId, dataForFacetFilter){
                let filteredData

                //-----art_type
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, dataForFacetFilter, "field_artist_districts")
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----bookinng_price
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, filteredData, "field_artist_artistic_categories")
                }
                
                //-----art_Type
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, filteredData, "field_artist_bk_price")
                }
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, filteredData, "field_county")
                }
                //-----population_type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, filteredData, "field_artist_population_types")
                }
                //-----engagemennt_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, filteredData)
                }
                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)
                if(selectedDistrict.length == 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }
                } else if(selectedDistrict.length != 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedPopulation.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else{
                    printAllList(dataWithoutDuplicacy,ulId)
                }
                searchFilter(dataWithoutDuplicacy)
            }

            //---population_type facet functionality
            function filterFunctionalityPopulationType(selectedFacetType, idRelatedField, ulId, dataForFacetFilter){
                let filteredData
                //-----population_type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, dataForFacetFilter, "field_artist_population_types")
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----bookinng_price
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, filteredData, "field_artist_artistic_categories")
                }
                
                //-----art_Type
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, filteredData, "field_artist_bk_price")
                }
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, filteredData, "field_county")
                }
                //-----art_type
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, filteredData, "field_artist_districts")
                }
                //-----engagemennt_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, filteredData)
                }
                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)
                if(selectedPopulation.length == 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }
                } else if(selectedPopulation.length != 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedEngagement.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else{
                    printAllList(dataWithoutDuplicacy,ulId)
                }
                searchFilter(dataWithoutDuplicacy)
            
            }
            //----- engagement type facet functionality
            function filterFunctionalityEngagementType(selectedFacetType, idRelatedField, ulId, dataForFacetFilter){
                let filteredData
                //-----engagement_type
                if(selectedEngagement.length > 0){
                    filteredData = returnFilteredEngagementData(selectedEngagement, dataForFacetFilter)
                }else{
                    filteredData =dataForFacetFilter
                }
                //-----population type
                if(selectedPopulation.length > 0){
                    filteredData = returnFilteredData(selectedPopulation, filteredData, "field_artist_population_types")
                }
                //-----bookinng_price
                if(selectedArtType.length > 0){
                    filteredData = returnFilteredData(selectedArtType, filteredData, "field_artist_artistic_categories")
                }
                
                //-----art_Type
                if(selectedPrice.length > 0){
                    filteredData = returnFilteredData(selectedPrice, filteredData, "field_artist_bk_price")
                }
                //-----county (in html-> location)
                if(selectedCounty.length > 0){
                    filteredData = returnFilteredData(selectedCounty, filteredData, "field_county")
                }
                //-----art_type
                if(selectedDistrict.length > 0){
                    filteredData = returnFilteredData(selectedDistrict, filteredData, "field_artist_districts")
                }

                let dataWithoutDuplicacy = removeDuplicate(filteredData)
                printCards(dataWithoutDuplicacy)
                if(selectedEngagement.length == 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0)){
                    printAllList(dataWithoutDuplicacy)
                    let x= checkEmpty()
                    if(x){
                        singleList(dataForFacetFilter,x)
                    }
                } else if(selectedEngagement.length != 0 && (selectedCounty.length != 0 || selectedArtType.length != 0 || selectedPrice.length != 0 || selectedDistrict.length != 0 || selectedPopulation.length != 0)){
                    printAllList(dataWithoutDuplicacy, ulId)
                }else{
                    printAllList(dataWithoutDuplicacy,ulId)
                }
                searchFilter(dataWithoutDuplicacy)
            }

            //--- printing selected values
            var SelectedValuesWrap = document.querySelector("#selected-data")
            function printSelectedValues(idRelatedField){
                let AllfacetsArr = [selectedArtType,selectedCounty,selectedDistrict,selectedEngagement,selectedPopulation,selectedPrice]
                if(selectedArtType.length ==0 && selectedPrice.length ==0 &&selectedDistrict.length ==0 &&selectedPopulation.length ==0 &&selectedCounty.length ==0 && selectedEngagement.length ==0){
                    SelectedValuesWrap.parentNode.classList.add("hide")
                }else{
                    SelectedValuesWrap.parentNode.classList.remove("hide")
                    let selectedValHtml = ""
                    AllfacetsArr.map((facetArr)=>{
                        facetArr.map(arrayVal=>{
                            selectedValHtml += `<div class="selected-val"><a class="selected-val-wrap">.</a><span class="val" value="${arrayVal}">${arrayVal}</span><div class="cross"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M1 1L13 13M1 13L13 1" stroke="#005677" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div>`
                        })
                    })

                    SelectedValuesWrap.innerHTML = selectedValHtml
                }
               
            }

            //---- clearAll handler

            var clearAllBtn = document.querySelector("#clear-all")
            function clearAll(){
                var checkBoxes = document.querySelectorAll(".filter-wrap input")
                clearAllBtn.addEventListener("click",()=>{
                    document.querySelectorAll(".blue-checkbox").forEach(box => {
                        box.checked = false;
                    });
                    selectedArtType = []
                    selectedPrice = []
                    selectedDistrict = []
                    selectedPopulation = []
                    selectedCounty = []
                    selectedEngagement = []
                    printCards(artistData)
                    printSelectedValues()
                    printAllList(artistData)
                    searchBox.value = ""
                    checkBoxes.forEach((box)=>{
                        box.checked = false
                    })
                })
            }clearAll()
            //selected tag click handler


            function decodeHtmlEntities(str) {
                const txt = document.createElement('textarea');
                txt.innerHTML = str;
                return txt.value;
            }
            //return data after filtering
            function returnFilteredData(selectedFacetArray, dataForFiltering, idRelatedField){
                let filteredDataArray = []
            
                selectedFacetArray.map((facetVal)=>{
                    for (let dataItm of dataForFiltering) {
                        if(decodeHtmlEntities(dataItm[idRelatedField]).includes(facetVal)){
                            filteredDataArray.push(dataItm)
                        }
                    }
                })
                return filteredDataArray
            }

            function returnFilteredEngagementData(selectedEngagement, dataForFacetFilter){
                let filteredDataArray = []
                selectedEngagement.map((facetVal)=>{
                    for (let dataItm of dataForFacetFilter) {
                        if(dataItm[facetVal] == "1"){
                            filteredDataArray.push(dataItm)
                        }
                    }
                })
                return filteredDataArray
            }
            //-----filter remove duplicate data
            function removeDuplicate(forSorting) {
                let refined =  forSorting.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                        t.title === thing.title
                    ))
                )
                return refined
            }

            function removeUncheckedBoxListItem(wrapper){
                let listItems = wrapper.querySelectorAll('li');
                let alreadyCheckedBoxes = []
                listItems.forEach(li => {
                    // Check if the <li> contains a checked checkbox
                    let hasCheckedCheckbox = li.querySelector('input[type="checkbox"]:checked');
                    if (hasCheckedCheckbox) {
                        let val = li.querySelector('input[type="checkbox"]').value
                        alreadyCheckedBoxes.push(val)
                    }
                });
                return alreadyCheckedBoxes
            }



    // END of fetch 
    })

}




