new Promise(function(resolve){
    if(document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function(){
    return new Promise(function(resolve, reject){
       VK.init({
        apiId: 5376153
    }); 
       VK.Auth.login(function(response) {
        if (response.session) {//если приложение инициализировано юзером
            resolve();//ресолвим промис, активируется следующий then
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 2);//доступ к списку друзей
    });
}).then(function(){
    return new Promise(function(resolve, reject){
        VK.api('friends.get', {'fields': 'photo_50, first_name, last_name'}, function(response){
            if(response.error) {
                reject(new Error(response.error.error_msg));
            } else {

                var source = friendsItemTemplate.innerHTML,
                    templateFn = Handlebars.compile(source),
                    template = templateFn({list: response.response});
                friendList.innerHTML = template;
                resolve();
            }
        });
    });
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});  

