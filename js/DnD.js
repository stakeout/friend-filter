frSaveBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var uIDArr = [];
            for (var i = 0; i < filteredFriendsArray.length; i++) {
                uIDArr[i] = filteredFriendsArray[i].uid;
            }
            localStorage.setItem('filteredFriends', uIDArr);

            addClass(filteredFriendList.parentNode, 'saved');
            setTimeout(function(){
                removeClass(filteredFriendList.parentNode, 'saved');
            }, 1000);
        });
