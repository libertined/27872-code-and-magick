//getMessage(a:*, b:*=):string  ?? *-любой, а *=, предопределенное значение?
var getMessage = function(a,b){
    switch (typeof(a)) {
        case 'boolean':
            if(a)
                return 'Я попал в '+b;
            else
                return 'Я никуда не попал';
        break;
        case 'number':
            return 'Я прыгнул на '+ a*100 +' сантиметров';
            break;
        default:
            if(a instanceof Array && b instanceof Array){
                var sum = 0,
                    minLength = Math.min(a.length, b.length);
                for(var i=0; i < minLength; i++ ){
                    sum += a[i]*b[i];
                }
                return 'Я прошёл '+sum+' метров';
            }
            else if(a instanceof Array){
                var sum = 0,
                    aLength =a.length;
                for(var i=0; i < aLength; i++ ){
                    sum += a[i];
                }
                return 'Я прошёл '+sum+' шагов';
            }
        break;
    }
};
