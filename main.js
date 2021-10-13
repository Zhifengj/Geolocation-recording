
async function loaddata(url, table) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    const response = await fetch(url);
    const data = await response.json();

    //clear table
    tableHead.innerHTML = "<tr></tr>";
    tableBody.innerHTML = "";

    //some variables
    var tempObj;
    var OSU_lat = 44.5673436
    var OSU_long = -123.278155

    //loop through array of objects
    for (let i = 0; i < data.length; i++) {
        tempObj = data[i];
        //populate table rows
        const rowElement = document.createElement("tr");
        //populate table row data
        for (const x in tempObj) {
            const cellElement = document.createElement("td");
            cellElement.textContent = tempObj[x];
            rowElement.appendChild(cellElement);
        }

        //populate distance data
        const distanceCell = document.createElement("td");
        distanceCell.textContent = distance(OSU_lat, OSU_long, tempObj.lat, tempObj.lng).toFixed(2);
        //append cell to row
        rowElement.appendChild(distanceCell);
        //append row to table body
        tableBody.appendChild(rowElement);
    }


    //populate table headers from JSON object
    for (const headerText in tempObj) {
        const headerElement = document.createElement("th");
        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
    }
    //add distance table header
    const distanceHeader = document.createElement("th");
    distanceHeader.textContent = "Distance from OSU (miles)";

   //add event listener for sorting
    distanceHeader.addEventListener('click', function () {
        sortTable();
    });

    tableHead.querySelector("tr").appendChild(distanceHeader);

}

//table sorting function referenced from : https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable() {
    //some variables
    var table = document.getElementById("myTable");
    var rows, i;
    var switching = true;
    var first_row, second_row;
    var switchcount = 0;
    var sort_direction = 0; //ascending direction

    //start loop
    while (switching) {
        switching = false;
        rows = table.rows;
        //go through table data
        for (i = 1; i < (rows.length - 1); i++) {
            //get first and second row disctance
            first_row = rows[i].getElementsByTagName("td")[3];
            second_row = rows[i + 1].getElementsByTagName("td")[3];
            //dir is asc
            if (sort_direction == 0) {
                if (Number(first_row.innerHTML) > Number(second_row.innerHTML)) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                    break;
                }
            } else {
              //dir is desc
                if (Number(first_row.innerHTML) < Number(second_row.innerHTML)) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                    break;
                }
            }
        }
        //change direction after each click
        if (switchcount == 0 && sort_direction == 0) {
            sort_direction = 1;
            switching = true;
        }
    }
}

loaddata("https://s3-us-west-2.amazonaws.com/cdt-web-storage/cities.json", document.querySelector("table"));
