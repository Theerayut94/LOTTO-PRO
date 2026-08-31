
// =====================================
// LOTTO PRO SEND
// =====================================


const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxQSKp7O14gb-7j5R4heJN-VORFY4yoMFr80j4ROcHRM3ZEbUePYJVhNTubidJwGJJp/exec";



// =====================================
// ELEMENT
// =====================================


const refreshBtn =
document.getElementById("refreshBtn");


const dataBody =
document.getElementById("dataBody");


const status =
document.getElementById("status");


const startNo =
document.getElementById("startNo");


const endNo =
document.getElementById("endNo");


const copyTopBtn =
document.getElementById("copyTopBtn");


const copyTodBtn =
document.getElementById("copyTodBtn");


const copyInfo =
document.getElementById("copyInfo");


const clearCopiedBtn =
document.getElementById("clearCopiedBtn");


const emptyMessage =
document.getElementById("emptyMessage");



// =====================================
// DATA
// =====================================


let sendData = [];



// =====================================
// COPY STATUS
// =====================================
//
// เก็บสถานะในเครื่อง
//
// top = Copy บนแล้ว
// tod = Copy โต๊ดแล้ว
//
// =====================================


let copiedStatus =

    JSON.parse(

        localStorage.getItem(
            "lottoProCopied"
        ) || "{}"

    );



// =====================================
// SAVE COPY STATUS
// =====================================


function saveCopiedStatus(){

    localStorage.setItem(

        "lottoProCopied",

        JSON.stringify(
            copiedStatus
        )

    );

}



// =====================================
// LOAD DATA
// =====================================


async function loadData(){


    refreshBtn.disabled = true;


    refreshBtn.innerHTML =
        "กำลังโหลด...";


    status.textContent =
        "กำลังโหลดข้อมูล...";


    try{


        const response =
            await fetch(

                GOOGLE_SCRIPT_URL,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "text/plain;charset=utf-8"

                    },

                    body:JSON.stringify({

                        action:"loadSend"

                    })

                }

            );


        sendData =
            await response.json();



        // -----------------------------
        // เรียง No. 1 → ล่าสุด
        // -----------------------------

        sendData.sort(

            (a,b)=>

                Number(a.no) -
                Number(b.no)

        );



        renderData();



        status.textContent =
            "ทั้งหมด " +
            sendData.length +
            " รายการ";


    }


    catch(error){


        console.error(error);


        status.textContent =
            "โหลดข้อมูลไม่สำเร็จ";


    }


    refreshBtn.disabled = false;


    refreshBtn.innerHTML =
        "🔄 รีเฟรชข้อมูล";

}



// =====================================
// RENDER DATA
// =====================================


function renderData(){


    let html = "";



    if(sendData.length === 0){

        dataBody.innerHTML = "";

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";



    sendData.forEach(row=>{


        let statusHtml = "";



        // -----------------------------
        // สถานะ Copy บน
        // -----------------------------

        if(copiedStatus[row.no]?.top){

            statusHtml += `

                <span
                    class="copied-badge copied-top">

                    ✓ บน

                </span>

            `;

        }



        // -----------------------------
        // สถานะ Copy โต๊ด
        // -----------------------------

        if(copiedStatus[row.no]?.tod){

            statusHtml += `

                <span
                    class="copied-badge copied-tod">

                    ✓ โต๊ด

                </span>

            `;

        }



        // -----------------------------
        // ส่งบน
        // -----------------------------

        let topHtml =
            row.top
            ?

            row.top

            :

            `<span class="empty-value">—</span>`;



        // -----------------------------
        // ส่งโต๊ด
        // -----------------------------

        let todHtml =
            row.tod
            ?

            row.tod

            :

            `<span class="empty-value">—</span>`;



        html += `

        <div class="data-card">


            <div class="number-header">

                <span class="no">

                    No. ${row.no}

                </span>


                <span class="number">

                    ${row.top || row.tod
                        ? getNumber(row)
                        : getNumber(row)}

                </span>

            </div>



            <div class="send-grid">


                <div class="send-box top">


                    <div class="send-label">

                        ส่งบน

                    </div>


                    <div class="send-value">

                        ${topHtml}

                    </div>


                </div>



                <div class="send-box tod">


                    <div class="send-label">

                        ส่งโต๊ด

                    </div>


                    <div class="send-value">

                        ${todHtml}

                    </div>


                </div>


            </div>



            ${
                statusHtml

                ?

                `

                <div class="copied-status">

                    ${statusHtml}

                </div>

                `

                :

                ""

            }


        </div>

        `;

    });



    dataBody.innerHTML = html;

}



// =====================================
// ดึงเลขจาก 123@200
// =====================================


function getNumber(row){


    if(row.top){

        return String(row.top)
            .split("@")[0];

    }


    if(row.tod){

        return String(row.tod)
            .split("@")[0];

    }


    return "---";

}



// =====================================
// GET SELECTED ROWS
// =====================================


function getSelectedRows(){


    let start =
        Number(startNo.value);


    let end =
        Number(endNo.value);



    if(!start || !end){

        copyInfo.textContent =
            "กรุณาระบุรายการเริ่มและรายการสิ้นสุด";

        return null;

    }



    if(start < 1){

        copyInfo.textContent =
            "รายการเริ่มต้องไม่น้อยกว่า 1";

        return null;

    }



    if(end < start){

        copyInfo.textContent =
            "รายการสิ้นสุดต้องมากกว่าหรือเท่ากับรายการเริ่ม";

        return null;

    }



    let count =
        end - start + 1;



    if(count > 20){

        copyInfo.textContent =
            "⚠️ เลือกได้ไม่เกิน 20 รายการ";

        return null;

    }



    let rows =
        sendData.filter(row=>{

            let no =
                Number(row.no);

            return no >= start &&
                   no <= end;

        });



    if(rows.length === 0){

        copyInfo.textContent =
            "ไม่พบข้อมูลในช่วงที่เลือก";

        return null;

    }



    copyInfo.textContent =
        `เลือก ${rows.length} รายการ`;



    return rows;

}



// =====================================
// MARK COPIED
// =====================================


function markCopied(rows,type){


    rows.forEach(row=>{


        if(!copiedStatus[row.no]){

            copiedStatus[row.no] = {};

        }


        copiedStatus[row.no][type] = true;


    });



    saveCopiedStatus();


    renderData();

}



// =====================================
// COPY TOP
// =====================================


copyTopBtn.addEventListener(

    "click",

    async function(){


        let rows =
            getSelectedRows();


        if(!rows){

            return;

        }



        let validRows =

            rows.filter(

                row => row.top !== ""

            );



        if(validRows.length === 0){

            alert(
                "ไม่มีข้อมูลส่งบน"
            );

            return;

        }



        let text =

            validRows

            .map(

                row => row.top

            )

            .join("\n");



        let success =

            await copyText(

                text

            );



        if(success){

            markCopied(

                validRows,

                "top"

            );


            alert(

                `Copy บนแล้ว ${validRows.length} รายการ`

            );

        }

    }

);



// =====================================
// COPY TOD
// =====================================


copyTodBtn.addEventListener(

    "click",

    async function(){


        let rows =
            getSelectedRows();


        if(!rows){

            return;

        }



        let validRows =

            rows.filter(

                row => row.tod !== ""

            );



        if(validRows.length === 0){

            alert(
                "ไม่มีข้อมูลส่งโต๊ด"
            );

            return;

        }



        let text =

            validRows

            .map(

                row => row.tod

            )

            .join("\n");



        let success =

            await copyText(

                text

            );



        if(success){

            markCopied(

                validRows,

                "tod"

            );


            alert(

                `Copy โต๊ดแล้ว ${validRows.length} รายการ`

            );

        }

    }

);



// =====================================
// COPY CLIPBOARD
// =====================================


async function copyText(text){


    try{


        await navigator.clipboard.writeText(

            text

        );


        return true;


    }


    catch(error){


        try{


            let textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value = text;


            textarea.style.position =
                "fixed";


            textarea.style.opacity =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.select();


            document.execCommand(
                "copy"
            );


            textarea.remove();


            return true;


        }


        catch(error2){


            alert(
                "ไม่สามารถคัดลอกข้อมูลได้"
            );


            return false;

        }

    }

}



// =====================================
// CLEAR COPIED STATUS
// =====================================


clearCopiedBtn.addEventListener(

    "click",

    function(){


        let check =
            confirm(

                "ต้องการล้างสถานะ Copy ทั้งหมดหรือไม่?"

            );


        if(!check){

            return;

        }



        copiedStatus = {};



        localStorage.removeItem(

            "lottoProCopied"

        );



        renderData();



        alert(

            "ล้างสถานะ Copy แล้ว"

        );

    }

);



// =====================================
// INPUT RANGE
// =====================================


startNo.addEventListener(

    "input",

    function(){

        if(

            startNo.value &&
            endNo.value

        ){

            getSelectedRows();

        }

    }

);



endNo.addEventListener(

    "input",

    function(){

        if(

            startNo.value &&
            endNo.value

        ){

            getSelectedRows();

        }

    }

);



// =====================================
// REFRESH
// =====================================


refreshBtn.addEventListener(

    "click",

    loadData

);



// =====================================
// INITIAL LOAD
// =====================================


window.addEventListener(

    "load",

    loadData

);