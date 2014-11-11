var myProfile = {};
var d = document;

//物件的觀察者
function observer(changes) {
  d.querySelector('.log').innerText = '';
  changes.forEach(function(change, i) {
    var newValue = change.object[change.name];
    var logText = "做了什麼？"+change.type+
                  "<br>更動欄位是: "+change.name+
                  "<br>更動前的值: "+change.oldValue+
                  "<br>更動後的值: "+newValue;
    
    d.querySelector('.log').innerHTML = logText;
    d.querySelector('.json').value = JSON.stringify(myProfile);
    
    updateBoundElements(change.name, newValue);
  });
}

//更新所有繫結的元素
function updateBoundElements(changeName, newValue) {
  var elements = d.querySelectorAll('[data-bind='+changeName+']');

  for(var i = 0; i < elements.length; i++) {
    var tagName = elements[i].tagName.toLowerCase();

    if(tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      var inputType = elements[i].type.toLowerCase();

      switch(inputType) {
        case 'radio':
          if(elements[i].value === newValue) {
            elements[i].checked = 1;
          }
          break;
        case 'checkbox':
          if(newValue.indexOf(elements[i].value) !== -1) {
            elements[i].checked = 1;
          } else {
            elements[i].checked = 0;
          }
          break;
        default:
          elements[i].value = newValue;
          break;
      }
    } else {
      elements[i].innerHTML = newValue;
    }
  }
}

//更新物件
function updateObject() {
  if(this.type === 'checkbox') {
    var data = [], elements = d.querySelectorAll('input[name=interest]:checked');
    for(var i=0; i<elements.length; i++) {
      data.push(elements[i].value);
    }
    myProfile[this.dataset.bind] = data;
  } else {
    myProfile[this.dataset.bind] = this.value;
  }
}

//這裡將物件轉成json放進textarea
//供user自行編輯物件內容來試驗雙向資料繫結
function updateObjectFromJSON() {
  var json = JSON.parse(this.value);
  for(var i in json) {
    myProfile[i] = json[i];
  }
  for(var i in myProfile) {
    if(!json[i]) {
      delete myProfile[i];
    }
  }
}

//使用O.o()開始監聽物件
Object.observe(myProfile, observer);

//model test
myProfile.name = 'Aaron';
myProfile.gender = '男';
myProfile.constellation = '天秤';
myProfile.title = 'Full-stack Engineer';
myProfile.interest = ['寫程式','看電影','去旅行'];

//Event listeners
document.addEventListener('change', updateObject, false);

var e = d.querySelectorAll('.form input[type=text], .form textarea');
for(var i=0; i<e.length; i++) {
  e[i].addEventListener('keyup', updateObject, false);
}

var e = d.querySelectorAll('.form input[type=radio], .form input[type=checkbox], .form select');
for(var i=0; i<e.length; i++) {
  e[i].addEventListener('change', updateObject, false);
}

d.querySelector('.json').addEventListener('change', updateObjectFromJSON, false);
