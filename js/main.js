
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
        VK.api('friends.get', { 'fields': 'photo_50, first_name, last_name' }, function(response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                var allFriendsList = [];
                var friendList = document.querySelector('.friend-list-all');
                allFriendsList = response.response;

                var source = friendsItemTemplate.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({ list: allFriendsList });
                    friendList.innerHTML = template;
            }
            var dragZone = document.querySelector('.wrapper');
            var addedFriends   =  document.querySelector('.friend-list-filtered');
            var addItem = document.querySelectorAll('.add');
            var item;

            dragZone.addEventListener("dragstart", function(e) {
                item = e.target;
            });
            dragZone.addEventListener("dragover", function(e) {
                e.preventDefault();
            });

            dragZone.addEventListener( 'drop', moveFriend, true );
            dragZone.addEventListener('click', toggleMove, true);
            function moveFriend(e) {
                if(e.target === addedFriends || e.target.closest('.friend-list-filtered') && item.parentNode !== addedFriends ) {
                        addedFriends.appendChild(item);
                    
                } 
                else if ( e.target === friendList || e.target.closest('.friend-list-all') && item.parentNode !== friendList ){ 
                        friendList.appendChild(item);

                }
            }
            function toggleMove(e){
                e.stopPropagation();
                if(e.target.closest('ul.friend-list-all')) {
                    addedFriends.appendChild(e.target.closest('li.friend-list__item'));
                }
                else if(e.target.closest('ul.friend-list-filtered')) {
                    friendList.appendChild(e.target.closest('li.friend-list__item'));
                }
            } 
            resolve();

        });
    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});

