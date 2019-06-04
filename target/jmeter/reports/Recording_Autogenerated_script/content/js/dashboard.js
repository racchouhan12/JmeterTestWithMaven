/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9449275362318841, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Search_105 \/TestSite\/Index.html"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_50 \/ShopItV60\/default.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_45 \/ShopItV60\/card.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Search_111 \/ShopItV60\/default.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_47 \/ShopItV60\/acknowledge.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_44 \/ShopItV60\/kindofpayment.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_49 \/ShopItV60\/fin.asp"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "Search_99 \/"], "isController": false}, {"data": [1.0, 500, 1500, "Search_127 \/ShopItV60\/product.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout_48 \/ShopItV60\/thanks.asp"], "isController": false}, {"data": [0.75, 500, 1500, "Checkout_42 \/ShopItV60\/main.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Search_126 \/ShopItV60\/checkselection.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Search_126 \/ShopItV60\/checkselection.asp-1"], "isController": false}, {"data": [1.0, 500, 1500, "Search_126 \/ShopItV60\/checkselection.asp-0"], "isController": false}, {"data": [1.0, 500, 1500, "Search_127 \/ShopItV60\/product.asp-0"], "isController": false}, {"data": [1.0, 500, 1500, "Search_119 \/ShopItV60\/main.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Buy_23 \/ShopItV60\/basket.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Buy_19 \/ShopItV60\/main.asp"], "isController": true}, {"data": [1.0, 500, 1500, "Checkout_43 \/ShopItV60\/checkout.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Search_121 \/ShopItV60\/main.asp"], "isController": false}, {"data": [1.0, 500, 1500, "Search_122 \/ShopItV60\/search.asp"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 300, 0, 0.0, 161.23999999999995, 0, 617, 274.0, 299.0, 548.0400000000018, 20.26068751266293, 32.38709151499291, 9.721106887789558], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Search_105 \/TestSite\/Index.html", 15, 0, 0.0, 138.13333333333335, 129, 143, 143.0, 143.0, 143.0, 1.2754017515517388, 2.14974943669756, 0.4732936187399031], "isController": false}, {"data": ["Checkout_50 \/ShopItV60\/default.asp", 15, 0, 0.0, 138.8, 129, 160, 150.4, 160.0, 160.0, 1.2798634812286689, 2.2910056260665526, 0.58493760665529], "isController": false}, {"data": ["Checkout_45 \/ShopItV60\/card.asp", 15, 0, 0.0, 212.53333333333333, 137, 288, 287.4, 288.0, 288.0, 1.2809564474807857, 2.7186132312126388, 0.6996891011955593], "isController": false}, {"data": ["Search_111 \/ShopItV60\/default.asp", 15, 0, 0.0, 137.73333333333332, 129, 143, 142.4, 143.0, 143.0, 1.2751849018107626, 2.3660657357816883, 0.4993644000255037], "isController": false}, {"data": ["Checkout_47 \/ShopItV60\/acknowledge.asp", 15, 0, 0.0, 172.33333333333334, 129, 278, 276.2, 278.0, 278.0, 1.2811752647762213, 2.054384555432183, 0.8962388164075845], "isController": false}, {"data": ["Checkout_44 \/ShopItV60\/kindofpayment.asp", 15, 0, 0.0, 136.26666666666662, 127, 141, 140.4, 141.0, 141.0, 1.2966804979253113, 0.7179017548409405, 0.6956150587828492], "isController": false}, {"data": ["Checkout_49 \/ShopItV60\/fin.asp", 15, 0, 0.0, 134.99999999999997, 127, 141, 140.4, 141.0, 141.0, 1.2804097311139564, 1.6505281690140845, 0.5151648527528809], "isController": false}, {"data": ["Search_99 \/", 30, 0, 0.0, 924.8666666666667, 254, 1856, 1739.9000000000005, 1827.95, 1856.0, 2.226510316164465, 17.86455627504824, 4.823380909529464], "isController": false}, {"data": ["Search_127 \/ShopItV60\/product.asp", 15, 0, 0.0, 170.26666666666665, 156, 190, 188.8, 190.0, 190.0, 1.2761613067891782, 4.057046404415519, 0.614817296239578], "isController": false}, {"data": ["Checkout_48 \/ShopItV60\/thanks.asp", 15, 0, 0.0, 135.2, 128, 141, 141.0, 141.0, 141.0, 1.280847066860217, 1.5864658494150798, 0.6283322036973785], "isController": false}, {"data": ["Checkout_42 \/ShopItV60\/main.asp", 30, 0, 0.0, 688.8999999999999, 135, 1269, 1251.4, 1268.45, 1269.0, 2.34192037470726, 16.0583162568306, 5.385197111631538], "isController": false}, {"data": ["Search_126 \/ShopItV60\/checkselection.asp", 15, 0, 0.0, 314.0666666666666, 284, 354, 351.0, 354.0, 354.0, 1.2582837010317927, 2.756018135013841, 1.2390326157621006], "isController": false}, {"data": ["Search_126 \/ShopItV60\/checkselection.asp-1", 15, 0, 0.0, 175.06666666666666, 156, 209, 199.4, 209.0, 209.0, 1.2731285011033782, 2.255575904982176, 0.613356178916992], "isController": false}, {"data": ["Search_126 \/ShopItV60\/checkselection.asp-0", 15, 0, 0.0, 138.06666666666666, 127, 155, 148.4, 155.0, 155.0, 1.2760527435133986, 0.5341809336452573, 0.6417648075287111], "isController": false}, {"data": ["Search_127 \/ShopItV60\/product.asp-0", 15, 0, 0.0, 0.6666666666666666, 0, 3, 1.8000000000000007, 3.0, 3.0, 1.294889502762431, 1.8224558118957184, 0.0], "isController": false}, {"data": ["Search_119 \/ShopItV60\/main.asp", 15, 0, 0.0, 137.93333333333334, 130, 142, 142.0, 142.0, 142.0, 1.2751849018107626, 1.5578674923488907, 0.5827993496557001], "isController": false}, {"data": ["Buy_23 \/ShopItV60\/basket.asp", 15, 0, 0.0, 166.2, 153, 185, 177.8, 185.0, 185.0, 1.2774655084312723, 2.0614101622381193, 0.6241782969255663], "isController": false}, {"data": ["Buy_19 \/ShopItV60\/main.asp", 15, 0, 0.0, 166.2, 153, 185, 177.8, 185.0, 185.0, 1.2774655084312723, 2.0614101622381193, 0.6241782969255663], "isController": true}, {"data": ["Checkout_43 \/ShopItV60\/checkout.asp", 15, 0, 0.0, 155.9333333333333, 130, 272, 264.2, 272.0, 272.0, 1.2804097311139564, 2.522557218309859, 0.621865663679044], "isController": false}, {"data": ["Search_121 \/ShopItV60\/main.asp", 15, 0, 0.0, 139.2, 129, 145, 144.4, 145.0, 145.0, 1.2750765045902754, 2.108109885030602, 0.7047786148418905], "isController": false}, {"data": ["Search_122 \/ShopItV60\/search.asp", 15, 0, 0.0, 138.66666666666669, 128, 146, 143.6, 146.0, 146.0, 1.2758356723653994, 1.7916520477162543, 0.583096772135749], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 300, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
