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
                allFriendsList = response.response;

                var source = friendsItemTemplate.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({ list: allFriendsList });
                friendList.innerHTML = template;

                var allListSearch = document.querySelector('.all-filter');
                var dropListsearch = document.querySelector('.dnd-filter');

                    allListSearch.addEventListener("input", function(e) {
                    var search = allListSearch.value.toLowerCase();

                    var seachFriends = allFriendsList.filter(function(value) {
                        var firstName = value.first_name;
                        var lastName = value.last_name;

                        return firstName.toLowerCase().indexOf(search) >=0 || lastName.toLowerCase().indexOf(search)>=0;

                    });

                    if (seachFriends.length) {
                        template = templateFn({ list: seachFriends });
                        friendList.innerHTML = template;
                    }
                });

                resolve();
            }
        });
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        var dragSrcEl = null;
        var dropTarget = document.querySelector('.drop-target');
        function handleDragStart(e) {
            this.classList.add('opacity'); // this / e.target is the source node.
            dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }
            e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
            return false;
        }

        function handleDrop(e) {
            // this / e.target is current target element.

            if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            // Don't do anything if dropping the same column we're dragging.
            if (dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the columnwe dropped on.
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

        }

        function handleDragEnd(e) {
            // this/e.target is the source node.

            [].forEach.call(cols, function(col) {
                col.classList.remove('opacity');
            });
        }

        var cols = document.querySelectorAll('.friend-list__item');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('drop', handleDrop, false);
            col.addEventListener('dragend', handleDragEnd, false);
        });

    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});
