new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5376153
        });
        VK.Auth.login(function(response) {
            if (response.session) { //если приложение инициализировано юзером
                resolve(); //ресолвим промис, активируется следующий then
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2); //доступ к списку друзей
    });
}).then(function() {
    return new Promise(function(resolve, reject) {

        var friendList = document.querySelector('.friend-list-all');
        var flagFriendsList = document.querySelector('.friend-list-filtered');
        var dragZone = document.querySelector('.wrapper');
        var addedFriends = document.querySelector('.friend-list-filtered');
        var item, friendObj;

        VK.api('friends.get', { 'fields': 'photo_50, first_name, last_name' }, function(response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                var allFriendsList = response.response;
                var friend = JSON.stringify(allFriendsList);
                friendObj = JSON.parse(friend);
                friendObj.forEach(function(elem, i, arr) {
                    elem.flag = false;
                });

                renderingFriendList();
            
            }

            dragZone.addEventListener("dragstart", function(e) {
                item = e.target;
            });
            dragZone.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            dragZone.addEventListener('drop', moveFriend, true);
            //drag and drop
            function moveFriend(e) {
                var userId = parseInt(item.getAttribute("data-id"));
                var user = friendObj.filter(function(value) {
                    return value.user_id == userId;
                })[0];
                if (e.target.closest('.friend-list-filtered') && item.parentNode !== addedFriends) {
                    user.flag = true;

                } else if (e.target.closest('.friend-list-all') && item.parentNode !== friendList) {
                    user.flag = false;

                }
                renderingFriendList();

            }

            function toggleMove(e) {
                var currentItem = e.target.closest('li.friend-list__item');
                var userId = parseInt(currentItem.getAttribute("data-id"));
                var user = friendObj.filter(function(value) {
                    return value.user_id == userId;
                })[0];
                if (e.target.closest('ul.friend-list-all')) {
                    user.flag = true;
                } else if (e.target.closest('ul.friend-list-filtered')) {
                    user.flag = false;
                }
                renderingFriendList();
                e.stopPropagation();

            }

            function renderingFriendList() {
                var source = friendsItemTemplate.innerHTML;
                var templateFn = Handlebars.compile(source);
                var friendListTemplate = templateFn({
                    list: friendObj.filter(function(value) {
                        return value.flag === false;
                    })
                });
                friendList.innerHTML = friendListTemplate;

                var flagFriendsListTemplate = templateFn({
                    list: friendObj.filter(function(value) {
                        return value.flag === true;
                    })
                });
                flagFriendsList.innerHTML = flagFriendsListTemplate;
                 updateEvents();
            }

            function updateEvents(){
                 var addItem = document.querySelectorAll('.toggle');
                //move element by click
                for (var i = 0; i < addItem.length; i++) {
                    addItem[i].addEventListener('click', toggleMove);
                }
            }



            //search
            leftSearch.addEventListener("input", function(e) {
                search(e);
            });


            rightSearch.addEventListener("input", function(e) {
                search(e);
            });

            /*function searchLeft(){
                var source = friendsItemTemplate.innerHTML;
                var templateFn = Handlebars.compile(source);
                var search = leftSearch.value.toLowerCase();
                var seachFriends = friendObj.filter(function(value) {
                    var firstName = value.first_name;
                    var lastName = value.last_name;
                    return value.flag === false && (firstName.toLowerCase().indexOf(search) === 0 || lastName.toLowerCase().indexOf(search) === 0);
                });

                if (seachFriends.length > 0) {
                    template = templateFn({ list: seachFriends });
                    friendList.innerHTML = template;
                } else {
                    friendList.innerHTML = "";
                }
                 updateEvents();
            }

            function searchRight(){
                var source = friendsItemTemplate.innerHTML;
                var templateFn = Handlebars.compile(source);
                var search = rightSearch.value.toLowerCase();
                var seachFriends = friendObj.filter(function(value) {
                    var firstName = value.first_name;
                    var lastName = value.last_name;
                    return value.flag === true && (firstName.toLowerCase().indexOf(search) === 0 || lastName.toLowerCase().indexOf(search) === 0);
                });

                if (seachFriends.length > 0) {
                    template = templateFn({ list: seachFriends });
                    flagFriendsList.innerHTML = template;
                } else {
                    flagFriendsList.innerHTML = "";
                }
                 updateEvents(); 
            }*/

            function search(e){
                var inputId = e.target.getAttribute("id");
                var input = e.target;
                var isFlag, friendsListOutput;
                if (inputId == "rightSearch"){
                    isFlag = true;
                    friendsListOutput = document.querySelector('.friend-list-filtered');
                } else if (inputId == "leftSearch"){
                    isFlag = false;
                    friendsListOutput = document.querySelector('.friend-list-all');
                }

                var source = friendsItemTemplate.innerHTML;
                var templateFn = Handlebars.compile(source);
                var search = input.value.toLowerCase();
                var seachFriends = friendObj.filter(function(value) {
                    var firstName = value.first_name;
                    var lastName = value.last_name;
                    return value.flag === isFlag && (firstName.toLowerCase().indexOf(search) === 0 || lastName.toLowerCase().indexOf(search) === 0);
                });

                if (seachFriends.length > 0) {
                    template = templateFn({ list: seachFriends });
                    friendsListOutput.innerHTML = template;
                } else {
                    friendsListOutput.innerHTML = "";
                }
                 updateEvents(); 
            }


            resolve();

        });
    });


}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});
