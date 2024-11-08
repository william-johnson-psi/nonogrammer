minRowCols = 5;
maxRowCols = 50;

$(document).ready(function() {
    /* Handle changes in Row Col Input, we want Row and Col inputs to ALWAYS be equal to each-other. */
    $(document).on('input', '#nonogram-gen-rows', updateColInput);
    $(document).on('input', '#nonogram-gen-cols', updateRowInput);
    
    /* Handle Submit Button, then generating empty grid. */ 
    $(document).on('click', '#gen-nonogram-btn', updateInputRowsCols);

    /* For Nonogram Creatiion, Handle Filling, X'ing, or Erasing Cells */ 
    $(document).on('click', '.cell', changeCell);
    /* Generate Grid */
    initGridPageLoad();

})




/**
 * Update Row/Col Inputs in the Session Storage.
 */
function updateInputRowsCols() {
    sessionStorage.inputRows = $('#nonogram-gen-rows').val();
    sessionStorage.inputCols = $('#nonogram-gen-cols').val();
}


/**
 * On Page Load, load default tile grid (5x5) or last submitted from sessionStorage
 */
function initGridPageLoad() {
    if (sessionStorage.inputRows === undefined || sessionStorage.inputCols === undefined) {
        sessionStorage.inputRows = 5;
        sessionStorage.inputCols = 5; 
    }

    /* Remember last used values for input boxes */
    $('#nonogram-gen-rows').val(sessionStorage.inputRows);
    $('#nonogram-gen-cols').val(sessionStorage.inputCols);
    generateEmptyGrid(sessionStorage.inputRows, sessionStorage.inputCols);
}


/**
 * When a Row Input is changed, set the Col Input to the Row Input 
 */
function updateColInput() {
    $('#nonogram-gen-cols').val($('#nonogram-gen-rows').val());
}

/**
 * When a Col Input is changed, set the Row Input to the Col Input
 */
function updateRowInput() {
    $('#nonogram-gen-rows').val($('#nonogram-gen-cols').val());
}

/**
 * If any input field violates Min/Maxes of Nonogram Input Fields, return a tuple. Refer below for more information
 * 
 * Return Value:
 *    [boolean, 0 or 1 or null] - 
 *    Item 0: 
 *        True/False whether if violation was found
 *    Item 1: 
 *        0 if it is a RowCol Min violation, 
 *        1 if it is a RowCol Max violation. 
 *        null if no violation found.
 *
 */
function checkMinMaxViolations() {
    row = $('#nonogram-gen-rows');
    col = $('#nonogram-gen-cols');
    if (row.val() < minRowCols || col.val() < minRowCols) {
        return [true, 0];
    }
    if (row.val() > maxRowCols || col.val() > maxRowCols) {
        return [true, 1];
    }
    return [false, null];
}


/**
 * Modify Cell and change to either Filled, X'd, or Blank, in this respecive order.
 * Also, update all data cell
 * 
 */
function changeCell() {
    curCell = $(this);
    if (curCell.hasClass("cell-blank")) {
        curCell.removeClass("cell-blank");
        curCell.addClass("cell-filled");
    }

    else if (curCell.hasClass("cell-filled")) {
        curCell.removeClass("cell-filled");
        curCell.addClass("cell-crossed");
        curCell.text('X');
    }

    else if (curCell.hasClass("cell-crossed")) {
        curCell.removeClass("cell-crossed");
        curCell.addClass("cell-blank");
        curCell.text('');
    }

    updateDataCells();
}

/**
 * With Row and Col Inputs #nonogram-gen-rows and #nonogram-gen-cols, append a grid layout to website
 * 
 * Parameters:
 *     rows : the amount of rows to create in nonogram
 *     cols : the amoutn of cols to create in nonogram.
 */
function generateEmptyGrid(rows, cols) {
    /* Set Grid */
    grid = $('#tile-grid-cells');
    /* Get Row Col Amount from Input Fields in HTML File */ 
    violationChecker = checkMinMaxViolations();
    if (violationChecker[0]) {
        switch(violationChecker[1]) {
            case 0:
                rows = 5;
                cols = 5;
                alert("Minimum Row/Col Value must be 5 or greater.\nAutomatically Setting Values to 5.");
                break;
            case 1:
                rows = 50;
                cols = 50;
                alert("Maximum Row/Col Value mus tbe 50 or lower.\nAutomatically Setting Values to 50.");
                break;
        }
    }
    /* Clear Grid of all TD and TR */
    grid.empty(); 

    /* Before creating rows, establish row of col data cells */
    grid.append('<tr id="column-data-cells">')
    /* Adding an empty table data to align rows/cols properly, because in HTML the row data cells can mess up the alignment */
    grid.append('<td></td>');
    for (var i = 0; i < cols; i++) {
        grid.append('<td id="data-cell-col-' + i + '" class="cell-data-col"></td>');
    }
    grid.append('</tr>');


    /* Here, we create the data-cell-rows as well as the rows of the grid themselves.*/
    for (var i = 0; i < rows; i++) {
        /* Create Row with ID */
        grid.append('<tr id="row-' + i + '">');
        /* Init Cur Row to Append to */
        curRow = $('#row-' + i);
        /* Add Data Cell at Beginning */
        curRow.append('<td class="cell-data-row" id="data-cell-row-' + i + '"></td>');
        for (var v = 0; v < cols; v++) {
            /* Append Cols to the Row we just created */
            curRow.append('<td id="row-' + i + 'col-' + v + '" class="cell cell-blank"></td>');
        }
        /* Close Row */
        grid.append('</tr>');
    }
}

/**
 * For creating a Nonogram, update *ALL* data cells with their respective values.    
 */
function updateDataCells() {
    rows = sessionStorage.inputRows;
    cols = sessionStorage.inputCols;
    curRowDataCell = null; 
    curColDataCell = null; 
    formattedText = "";
    /* Let's start with updating row data cells */ 
    for (var i = 0; i < rows; i++) {        
        curRowDataCell = $('#data-cell-row-' + i);
        formattedText = buildRowSequenceString(getRowSequence(i));
        curRowDataCell.text(formattedText);
    }

    /* Now update col cells */ 
    for (var i = 0; i < cols; i++) {
        curColDataCell = $('#data-cell-col-' + i);
        formattedText = buildColSequenceString(getColSequence(i));
        curColDataCell.text(formattedText); 
    }
}


/**
 * Given a data-row-cell sequence, return a formatted string for the cell
 * 
 * Parameters:
 *     sequence: Sequence of ints in an array, you can use getRowSequence for this parameter. 
 * 
 * Return Value: 
 *     Formatted string, could look like "5 4 9 7 20"
 */
function buildRowSequenceString(sequence) {
    formattedString = "";
    for (var i = 0; i < sequence.length; i++) {
        if (i == (sequence.length-1)) {
            formattedString += sequence[i];
        }
        else {
            formattedString += sequence[i] + " ";
        }
    }
    return formattedString;
}

/**
 * Given a data-row-cell sequence, return a formatted string for the cell
 * 
 * Parameters:
 *     sequence: Sequence of ints in an array, you can use getColSequence for this parameter. 
 * 
 * Return Value:
 *     Formatted string, could look like "5\n4\n9\n7\n20"
 */
function buildColSequenceString(sequence) {
    formattedString = "" 
    for (var i = 0; i < sequence.length; i++) {
        if (i == (sequence.length-1)) {
            formattedString += sequence[i];
        }
        else {
            formattedString += sequence[i] + '\n';
        }
    }
    return formattedString;
}
/**
 * Given a row number, find the sequence of filled cells in that row 
 * 
 * Parameters:
 *     row: A row index that is used to access a specific row in our grid structure.
 * 
 * Return Value:
 *     Array of Ints (i.e [20, 4, 7])
 */
function getRowSequence(row) {
    /* Getting current RowCol values */
    cols = sessionStorage.getItem('inputRows');
    /* Sequence of shaded cells will be updated as we go throught the row*/
    sequence = []; 
    /* This tracks the current sequence of adjacent shaded cells */
    curShadedCells = 0; 
    /* The current cell we are reviewing, and whether or not it's shaded */
    curCell = null;
    isShaded = false; 

    /* Go through the single row */
    for (var i = 0; i < cols; i++) {
        curCell = $('#row-' + row + 'col-' + i);
        isShaded = curCell.hasClass("cell-filled");
        /* If shaded, add on to the currently tracked adjacent cells total*/
        if (isShaded) {
            curShadedCells += 1; 
            /* Check to see if we are on the last cell of the row, if so push to sequence because we are done.*/
            if (i == cols-1) {
                sequence.push(curShadedCells);
            }
        }
        /* We didn't find a shaded cell, push to the sequence if adjacent cells total is larger than zero, and reset */
        else if (curShadedCells != 0) {
            sequence.push(curShadedCells);
            curShadedCells = 0;
        }
    }
    
    return sequence;
}

/**
 * Given a col number, find the sequence of filled cells in that column
 * 
 * Parameters:
 *     col: A col index that is used to access a specific col in our grid structure. 
 * 
 * Return Value:
 *     Array of Ints (i.e [20, 4, 7])
 */
function getColSequence(col) {
    /* Getting current RowCol values */
    rows = sessionStorage.getItem('inputRows');
    /* Sequence of shaded cells will be updated as we go throught the row*/
    sequence = []; 
    /* This tracks the current sequence of adjacent shaded cells */
    curShadedCells = 0; 
    /* The current cell we are reviewing, and whether or not it's shaded */
    curCell = null;
    isShaded = false; 

    /* Go through the single row */
    for (var i = 0; i < rows; i++) {
        curCell = $('#row-' + i + 'col-' + col);
        isShaded = curCell.hasClass("cell-filled");
        /* If shaded, add on to the currently tracked adjacent cells total*/
        if (isShaded) {
            curShadedCells += 1; 
            /* Check to see if we are on the last cell of the row, if so push to sequence because we are done.*/
            if (i == rows-1) {
                sequence.push(curShadedCells);
            }
        }
        /* We didn't find a shaded cell, push to the sequence if adjacent cells total is larger than zero, and reset */
        else if (curShadedCells != 0) {
            sequence.push(curShadedCells);
            curShadedCells = 0;
        }
    }
    return sequence;
}