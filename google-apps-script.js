// Google Sheets + Google Apps Script Web App Backend for JSONP

function doGet(e) {
  var callback = e.parameter.callback;
  var action = e.parameter.action;
  var result = { status: "error", message: "Invalid action" };
  
  var lock = LockService.getScriptLock();
  try {
    // Wait for up to 30 seconds for the lock
    lock.waitLock(30000);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure headers exist
    ensureHeaders(sheet);
    
    if (action === "read") {
      result = readData(sheet);
    } else if (action === "create") {
      result = createData(sheet, e.parameter);
    } else if (action === "update") {
      result = updateData(sheet, e.parameter);
    } else if (action === "delete") {
      result = deleteData(sheet, e.parameter);
    } else if (action === "like") {
      result = likeData(sheet, e.parameter);
    }
  } catch (err) {
    result = { status: "error", message: err.toString() };
  } finally {
    lock.releaseLock();
  }
  
  var json = JSON.stringify(result);
  var output = callback ? callback + "(" + json + ")" : json;
  var mimeType = callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  
  return ContentService.createTextOutput(output).setMimeType(mimeType);
}

function ensureHeaders(sheet) {
  var range = sheet.getRange(1, 1, 1, 10);
  var values = range.getValues()[0];
  if (!values[0]) {
    // Write headers: id, timestamp, class, names, title, link, abstract, password, likes, status
    sheet.appendRow(["id", "timestamp", "class", "names", "title", "link", "abstract", "password", "likes", "status"]);
  }
}

function readData(sheet) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return { status: "success", data: [] };
  }
  
  var headers = rows[0];
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0]) continue; // Skip if ID is empty
    if (row[9] === "DELETED") continue;
    
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      // Exclude password in read data to keep it secure
      if (headers[j] === "password") {
        continue;
      }
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  
  return { status: "success", data: data };
}

function createData(sheet, params) {
  var id = "id_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000);
  var timestamp = new Date().toISOString();
  var className = params.class || "";
  var names = params.names || "";
  var title = params.title || "";
  var link = params.link || "";
  var abstract = params.abstract || "";
  var password = params.password || ""; // 4-digit password
  var likes = 0;
  var status = "ACTIVE";
  
  // Headers: id, timestamp, class, names, title, link, abstract, password, likes, status
  sheet.appendRow([id, timestamp, className, names, title, link, abstract, password, likes, status]);
  
  return { status: "success", message: "Created successfully", id: id };
}

function updateData(sheet, params) {
  var id = params.id;
  var password = params.password;
  if (!id || !password) {
    return { status: "error", message: "Missing ID or password" };
  }
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      if (rows[i][9] === "DELETED") {
        return { status: "error", message: "Project not found or deleted" };
      }
      // Check password
      if (String(rows[i][7]) !== String(password)) {
        return { status: "error", message: "Password incorrect" };
      }
      
      // Update fields
      if (params.class !== undefined) sheet.getRange(i + 1, 3).setValue(params.class);
      if (params.names !== undefined) sheet.getRange(i + 1, 4).setValue(params.names);
      if (params.title !== undefined) sheet.getRange(i + 1, 5).setValue(params.title);
      if (params.link !== undefined) sheet.getRange(i + 1, 6).setValue(params.link);
      if (params.abstract !== undefined) sheet.getRange(i + 1, 7).setValue(params.abstract);
      
      return { status: "success", message: "Updated successfully" };
    }
  }
  
  return { status: "error", message: "Project not found" };
}

function deleteData(sheet, params) {
  var id = params.id;
  var adminPassword = params.adminPassword;
  
  if (adminPassword !== "geo123") {
    return { status: "error", message: "Admin password incorrect" };
  }
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      // Physically delete the row to keep Google Sheets clean
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Deleted successfully" };
    }
  }
  return { status: "error", message: "Project not found" };
}

function likeData(sheet, params) {
  var id = params.id;
  if (!id) {
    return { status: "error", message: "Missing ID" };
  }
  
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      if (rows[i][9] === "DELETED") {
        return { status: "error", message: "Project not found or deleted" };
      }
      var currentLikes = parseInt(rows[i][8]) || 0;
      var newLikes = currentLikes + 1;
      sheet.getRange(i + 1, 9).setValue(newLikes);
      return { status: "success", likes: newLikes };
    }
  }
  return { status: "error", message: "Project not found" };
}
