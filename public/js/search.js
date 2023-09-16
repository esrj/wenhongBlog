const toggleSearchButton = document.getElementById('toggle-search-button');
const searchContainer = document.getElementById('search-container');

toggleSearchButton.addEventListener('click', () => {
    searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
});

// 添加初始状态
searchContainer.style.display = 'none';

const search_user = document.getElementById('search_user')
const _csrf = document.getElementById('_csrf')
const search_user_result_list = document.getElementById('search_user_result_list')

search_user.addEventListener('keyup', function(event) {
    search_user.textContent =  event.target.value;
    if(event.target.value === ''){
        $("#search_user_result_list").empty()
    }else{
        axios.post('/search',{
            data:event.target.value,
            _csrf:_csrf.value
        }).then(res=>{
            $("#search_user_result_list").empty()
            if(res.data.errno === 0){
                res.data.users.forEach(item=>{
                    $("#search_user_result_list").append($(`
                    <tr style="display: block;margin-bottom: 5px">
                        <td  >
                            <a  href="/profile/${item._id}"><img style="margin-top: 5px" class="sidebar_img" src="/${item.image}"></a>
                        </td>
                        <td ><a style="color: black" href="/profile/${item._id}">${item.email}</a></td>
                    </tr>
                `))
                })
            }
        })
    }
});
