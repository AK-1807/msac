var inputWrappers = document.querySelectorAll(".filter-wrap input")
var wrappers = document.querySelectorAll(".filter-wrap")
let allListWraps = document.querySelectorAll(".filter-wrap ul")

inputWrappers.forEach((wrapper,i)=>{
   if(wrapper){
    wrapper.addEventListener("click",function(){
        let listWrap = (wrapper.closest(".filter-wrap")).querySelector("ul")
        wrappers.forEach((wrap,index)=>{
            if(index!= i){
                wrap.classList.remove("active")
            }
        })
        wrapper.closest(".filter-wrap").classList.contains("active") ? wrapper.closest(".filter-wrap").classList.remove("active") : wrapper.closest(".filter-wrap").classList.add("active")
      })
   }

})


function documentClickHandlerForToggleDropdown(){
    document.addEventListener("click",(e)=>{
        if(!e.target.closest(".filter-wrap")){
            wrappers.forEach((wrap,index)=>{
        
                wrap.classList.remove("active")
            
            })  
        }
    })
}
documentClickHandlerForToggleDropdown()

function filtersDropdownToggle(){
    const toggleBtn = document.querySelector(".dowpdown-toggle")
    const wrapper = document.querySelector("#wrapper")

    toggleBtn.addEventListener("click",function(){
        if(wrapper.classList.contains("max-h-[100rem]")){

                wrapper.classList.remove("max-h-[100rem]") 
                toggleBtn.textContent ="Show More Filters  +"
            }else{
                wrapper.classList.add("max-h-[100rem]")
                 toggleBtn.textContent ="Hide Filters  -"
            }
        
        
    })
}filtersDropdownToggle();
