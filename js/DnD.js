var dragZone = document.querySelector('.wrapper');

        var friendList     = document.querySelector('.friend-list');
        var addedFriends   = document.querySelector('.friend-list-filtered');
        var item;

        dragZone.addEventListener("dragstart", function(e) {
            item = e.target;
        });
        dragZone.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        dragZone.addEventListener( 'drop', moveFriend, true );

        function moveFriend(e) {
            if(e.target === addedFriends || e.target.closest('.friend-list') ) {
                if( item.parentNode !== addedFriends ) {
                    addedFriends.appendChild(item);
                }
            } else if( e.target === allFriends || e.target.closest('.friend-list-filtered') ){
                if( item.parentNode !== allFriends ) {
                    allFriends.appendChild(item);
                }
            }
        }
