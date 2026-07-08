// =====================================
// LOTTO PRO
// SCRIPT.JS
// PART 1 : INPUT + TAG SYSTEM
// =====================================


const numberInput = document.getElementById("numberInput");

const topInput = document.getElementById("topInput");

const todInput = document.getElementById("todInput");

const saveBtn = document.getElementById("saveBtn");

const tagContainer = document.getElementById("tagContainer");

const historyBody = document.getElementById("historyBody");



// รายการเลขที่คีย์

let tags = [];


// ประวัติ

let historyData = [];


// ลำดับ

let runningNo = 1;



// =====================================
// รับเฉพาะตัวเลข
// =====================================


function onlyNumber(value){

    return value.replace(/[^0-9]/g,'');

}




// =====================================
// ช่องหมายเลข
// ครบ 3 หลัก สร้าง Tag ทันที
// =====================================


numberInput.addEventListener("input",function(){


    this.value = onlyNumber(this.value);



    while(this.value.length >= 3){


        let number = this.value.substring(0,3);



        addTag(number);



        this.value = this.value.substring(3);


    }



});




// =====================================
// ช่องเงิน
// =====================================


topInput.addEventListener("input",function(){

    this.value = onlyNumber(this.value);

});



todInput.addEventListener("input",function(){

    this.value = onlyNumber(this.value);

});




// =====================================
// เพิ่ม TAG
// =====================================


function addTag(number){


    // กันเลขซ้ำ

    if(tags.includes(number)){

        return;

    }



    tags.push(number);



    renderTags();



}




// =====================================
// ลบ TAG
// =====================================


function removeTag(number){


    tags = tags.filter(

        item => item !== number

    );



    renderTags();


}




// =====================================
// แสดง TAG
// =====================================


function renderTags(){



    document.querySelectorAll(".tag")

    .forEach(item=>item.remove());





    tags.forEach(number=>{



        let tag = document.createElement("div");


        tag.className="tag";



        tag.innerHTML = `

            ${number}

            <span>×</span>

        `;



        tag.querySelector("span")

        .onclick=function(){


            removeTag(number);


        };



        tagContainer.insertBefore(

            tag,

            numberInput

        );



    });



    numberInput.focus();



}






// =====================================
// Enter เลื่อนไปช่องถัดไป
// =====================================


numberInput.addEventListener("keydown",function(e){


    if(e.key==="Enter"){

        topInput.focus();

    }


});



topInput.addEventListener("keydown",function(e){


    if(e.key==="Enter"){

        todInput.focus();

    }


});



todInput.addEventListener("keydown",function(e){


    if(e.key==="Enter"){

        saveBtn.click();

    }


});

// =====================================
// PART 2 : NUMBER LOGIC
// =====================================



// =====================================
// ตรวจเลขตอง
// เช่น 111 222 999
// =====================================

function isTriple(number){

    return (

        number[0] === number[1] &&

        number[1] === number[2]

    );

}




// =====================================
// ตรวจเลขกลับ 3 ตัว
// เช่น 101 121 122
// =====================================

function isThreeWay(number){


    if(isTriple(number)){

        return false;

    }



    let unique = new Set(

        number.split("")

    );



    return unique.size === 2;


}






// =====================================
// สร้างเลขกลับ 3 ตัว
// เลขหลักต้องอยู่ตัวแรก
// =====================================


function generateThreeWay(number){


    let result=[];



    function permute(arr,start){


        if(start===arr.length){


            let value=arr.join("");



            if(!result.includes(value)){

                result.push(value);

            }



            return;


        }



        let used=[];



        for(let i=start;i<arr.length;i++){



            if(used.includes(arr[i])){

                continue;

            }



            used.push(arr[i]);



            [

                arr[start],

                arr[i]

            ]=[

                arr[i],

                arr[start]

            ];



            permute(arr,start+1);




            [

                arr[start],

                arr[i]

            ]=[

                arr[i],

                arr[start]

            ];



        }



    }



    permute(

        number.split(""),

        0

    );



    // เอาเลขที่คีย์ไว้หน้าเสมอ


    result = [

        number,

        ...result.filter(

            item=>item!==number

        )

    ];



    return result;


}






// =====================================
// แบ่งเงิน
// เศษเงินให้เลขแรก
// =====================================


function divideMoney(amount,count){


    amount = Number(amount)||0;



    let result=[];



    let base=Math.floor(

        amount/count

    );



    let remain = amount-(base*count);




    for(let i=0;i<count;i++){


        result.push(base);


    }



    result[0]+=remain;



    return result;


}






// =====================================
// PART 9 : MONEY CALCULATION
// =====================================


// ตรวจเลขกลับ 3 ตัว
// เช่น 101 121 122
// =====================================

function isThreeWay(number){

    let a = number.split("");

    return (
        new Set(a).size === 2
    );

}



// ตรวจเลขตอง
// เช่น 111
// =====================================

function isTriple(number){

    return (
        number[0] === number[1] &&
        number[1] === number[2]
    );

}



// =====================================
// สร้างเลขกลับ 3 ตัว
// เลขหลักอยู่ตัวแรก
// =====================================

function generateThreeWay(number){


    let result=[];


    function permute(arr,start){


        if(start===arr.length){


            let value=arr.join("");

            if(!result.includes(value)){

                result.push(value);

            }

            return;

        }



        for(let i=start;i<arr.length;i++){


            [
                arr[start],
                arr[i]
            ]=[
                arr[i],
                arr[start]
            ];



            permute(arr,start+1);



            [
                arr[start],
                arr[i]
            ]=[
                arr[i],
                arr[start]
            ];

        }

    }



    permute(

        number.split(""),

        0

    );



    return [

        number,

        ...result.filter(

            x=>x!==number

        )

    ];

}



// =====================================
// แบ่งเงินโต๊ด
// เศษให้เลขหลัก
// =====================================

function splitTodMoney(total,count){


    let result=[];


    let base=Math.floor(

        total/count

    );


    let remain=

        total-(base*count);



    for(let i=0;i<count;i++){


        result.push(base);


    }



    result[0]+=remain;



    return result;

}



// =====================================
// คำนวณเลขแต่ละตัว
// =====================================

function calculateNumber(number,top,tod){


    let rows=[];


    top=Number(top)||0;

    tod=Number(tod)||0;



    // -----------------------------
    // เลขตอง
    // รวมทั้งหมด
    // -----------------------------

    if(isTriple(number)){


        rows.push({

            number:number,

            top:top+tod,

            tod:0

        });


        return rows;

    }




    // -----------------------------
    // เลขกลับ 3 ตัว
    // แตก
    // -----------------------------

    if(isThreeWay(number)){


        let numbers=

            generateThreeWay(number);



        let money=

            splitTodMoney(

                tod,

                numbers.length

            );



        numbers.forEach((item,index)=>{


            rows.push({


                number:item,


                top:

                index===0

                ?

                top+money[index]

                :

                money[index],



                tod:0


            });



        });



        return rows;


    }




    // -----------------------------
    // เลขกลับ 6 ตัว
    // ไม่แตก
    // -----------------------------


    rows.push({

        number:number,

        top:top,

        tod:tod

    });



    return rows;


}
// =====================================
// PART 11 : FINAL SAVE SYSTEM
// =====================================


let isSaving = false;



saveBtn.addEventListener(

"click",

async function(){



    if(isSaving){

        return;

    }



    if(tags.length===0){


        alert(

            "กรุณากรอกหมายเลข"

        );


        numberInput.focus();


        return;

    }




    let top = Number(

        topInput.value

    )||0;



    let tod = Number(

        todInput.value

    )||0;





    if(top===0 && tod===0){


        alert(

            "กรุณากรอกจำนวนเงิน"

        );


        topInput.focus();


        return;


    }




    isSaving=true;



    saveBtn.innerHTML=

    "กำลังบันทึก...";



    saveBtn.disabled=true;





    let tempRows=[];



    tags.forEach(number=>{



        let result = calculateNumber(

            number,

            top,

            tod

        );



        tempRows.push(

            ...result

        );



    });





    // สร้าง No + ID

    let newRows=

        prepareRows(

            tempRows

        );






    // แสดงหน้าเว็บทันที

    historyData.unshift(

        ...newRows

    );



    renderHistory();






    // ส่ง Google Sheet

    await syncToGoogleSheet(

        newRows

    );






    clearInput();





    saveBtn.innerHTML=

    "บันทึก";



    saveBtn.disabled=false;



    isSaving=false;



});






// =====================================
// แสดงประวัติ
// =====================================


function renderHistory(){



    historyBody.innerHTML="";





    historyData.forEach(row=>{



        let tr=document.createElement("tr");





        tr.innerHTML=`

        <td>${row.no}</td>

        <td>${row.number}</td>

        <td>${row.top}</td>

        <td>${row.tod}</td>

        <td>

        <button

        class="delete-btn"

        onclick="deleteRow('${row.id}')">

        ×

        </button>

        </td>

        `;





        historyBody.appendChild(tr);



    });



}









// =====================================
// ลบรายการ
// =====================================


function deleteRow(id){



    let check = confirm(

        "ต้องการลบรายการนี้หรือไม่?"

    );



    if(!check){

        return;

    }





    historyData = historyData.filter(

        row=>row.id!==id

    );





    renderHistory();




    deleteFromGoogleSheet(id);



}







// =====================================
// เคลียร์ช่อง
// =====================================


function clearInput(){



    tags=[];



    renderTags();



    numberInput.value="";


    topInput.value="";


    todInput.value="";



    numberInput.focus();



}






// =====================================
// SAVE TO GOOGLE SHEET
// =====================================


async function syncToGoogleSheet(data){


    if(!GOOGLE_SCRIPT_URL){

        console.log("ยังไม่ได้ตั้งค่า URL");

        return;

    }



    try{


        const response = await fetch(

            GOOGLE_SCRIPT_URL,

            {

                method:"POST",

                mode:"no-cors",

                headers:{

                    "Content-Type":

                    "text/plain;charset=utf-8"

                },

                body:JSON.stringify({

                    action:"save",

                    data:data

                })

            }

        );



        console.log(

            "ส่งข้อมูลแล้ว"

        );



    }

    catch(error){


        console.error(error);


    }


}





// =====================================
// DELETE GOOGLE SHEET
// =====================================


async function deleteFromGoogleSheet(id){



    if(!GOOGLE_SCRIPT_URL){

        return;

    }




    await fetch(

        GOOGLE_SCRIPT_URL,

        {

            method:"POST",

            mode:"no-cors",

            headers:{

                "Content-Type":

                "text/plain;charset=utf-8"

            },

            body:JSON.stringify({

                action:"delete",

                id:id

            })

        }

    );



}

// =====================================
// LOAD DATA FROM GOOGLE SHEET
// =====================================


window.addEventListener("load",function(){

    loadFromGoogleSheet();

});





function loadFromGoogleSheet(){


    if(!GOOGLE_SCRIPT_URL){

        return;

    }



    fetch(GOOGLE_SCRIPT_URL,{

        method:"POST",

        headers:{

            "Content-Type":"text/plain"

        },


        body:JSON.stringify({

            action:"load"

        })


    })

    .then(res=>res.json())


    .then(data=>{



        historyData = data || [];



        if(historyData.length>0){


            runningNo = Math.max(

                ...historyData.map(

                    item=>Number(item.no)

                )

            )+1;


        }



        renderHistory();



    })


    .catch(err=>{


        console.log(err);


    });


}

// =====================================
// PART 10 : DATA MANAGEMENT
// =====================================



// โหลดข้อมูลจาก Google Sheet
// =====================================

async function loadFromGoogleSheet(){


    if(!GOOGLE_SCRIPT_URL){

        return;

    }



    try{


        const response = await fetch(

            GOOGLE_SCRIPT_URL,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "text/plain;charset=utf-8"

                },


                body:JSON.stringify({

                    action:"load"

                })

            }

        );



        const data = await response.json();



        historyData = data;



        // เรียงใหม่ล่าสุดก่อน

        historyData.sort(

            (a,b)=>{

                return b.no-a.no;

            }

        );




        // หา No ล่าสุด

        if(historyData.length>0){


            runningNo =

            Math.max(

                ...historyData.map(

                    x=>Number(x.no)

                )

            )+1;


        }



        renderHistory();



    }

    catch(error){


        console.log(

            "Load error",

            error

        );


    }


}






// เรียกโหลดข้อมูลเมื่อเปิดเว็บ
// =====================================


window.addEventListener(

    "load",

    ()=>{


        loadFromGoogleSheet();



    }

);






// =====================================
// สร้าง ID ใหม่
// =====================================


function createID(){


    return (

        Date.now()

        +"_"

        +

        Math.random()

        .toString(36)

        .substring(2)

    );


}






// =====================================
// ปรับ saveData เดิม
// ให้มี ID แน่นอน
// =====================================


function prepareRows(rows){



    return rows.map(row=>{


        return {


            id:createID(),


            no:runningNo++,


            number:row.number,


            top:row.top,


            tod:row.tod


        };


    });


}

