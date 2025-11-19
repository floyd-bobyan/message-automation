import { useState, useEffect } from "react";
import styles from "./styles.module.scss";

const CLIENT_ID = "972701167072-mqonrb5linta1la5g41qc5drk2j2rktv.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const SHEET_ID = "1tqmznuZ-19-eQrbFeuKF1RPOrw5KLkKsE6qaT2Hw4qA";
const RANGE = "'Sheet1'!A1:Z100";

const PerformanceSheet = () => {
  const [empCode, setEmpCode] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState([]);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  // Load Google API script in browser only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        await window.gapi.client.init({
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4",
          ],
          scope: SCOPE,
        });
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(script);
  }, []);

  const onSubmit = async () => {
    if (!gapiLoaded) {
      alert("Google API is still loading, please wait a moment.");
      return;
    }

    setLoading(true);

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();

      // Sign in if not already
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      // Fetch sheet data
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: RANGE,
      });

      const allRows = response.result.values || [];

      // Optional filter
      const filteredRows = allRows.filter(
        (row) =>
          row[0]?.trim() === empCode.trim() &&
          row[1]?.trim() === companyCode.trim()
      );

      setSheetData(filteredRows);
    } catch (error) {
      console.error("Error fetching sheet:", error);
      alert(
        "Failed to fetch sheet data. Make sure you are signed in with the Google account that has view access."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["page-main"]}>
      <div className={styles["page-header"]}>Salary Messages</div>
      <div className={styles["page-contents"]}>
        <div className={styles["file-upload"]}>
          <div className={styles["file-upload-label"]}>Employee Details</div>
          <div className={styles["inputs-wrapper"]}>
            <input
              type="text"
              placeholder="Employee Code"
              onChange={(e) => setEmpCode(e.target.value)}
              value={empCode}
            />
            <input
              type="text"
              placeholder="Company Code"
              onChange={(e) => setCompanyCode(e.target.value)}
              value={companyCode}
            />
            <div
              className={styles["submit-button"]}
              onClick={() => onSubmit()}
            >
              {loading ? "Loading..." : "Submit"}
            </div>
          </div>
        </div>

        {sheetData.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  {sheetData[0].map((_, idx) => (
                    <th key={idx}>Column {idx + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceSheet;


// import { useEffect, useState } from "react";

// import styles from "./styles.module.scss"

// const CLIENT_ID = "972701167072-mqonrb5linta1la5g41qc5drk2j2rktv.apps.googleusercontent.com";
// const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
// const SHEET_ID = "SAVA-1"; // Replace with your Google Sheet ID
// const RANGE = "Sheet1!A1:C100";

// const PerformanceSheet = () => {
//     const [empCode, setEmpCode] = useState("")
//     const [companyCode, setCompanyCode] = useState("")
//     const [loading, setLoading] = useState(false);
//     const [sheetData, setSheetData] = useState([]);

//     const onChangeEmployeeCode = (e) => {
//         setEmpCode(e?.target?.value)
//     }

//     const onChangeCompanyCode = (e) => {
//         setCompanyCode(e?.target?.value)
//     }

//     // Initialize Google API client
//     const initClient = async () => {
//         await gapi.client.init({
//             clientId: CLIENT_ID,
//             discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//             scope: SCOPE,
//         });
//     };

//     const onSubmit = async () => {
//         setLoading(true);
//         try {
//             const authInstance = gapi.auth2.getAuthInstance();

//             // Sign in if not already
//             if (!authInstance.isSignedIn.get()) {
//                 await authInstance.signIn();
//             }

//             // Fetch sheet data
//             const response = await gapi.client.sheets.spreadsheets.values.get({
//                 spreadsheetId: SHEET_ID,
//                 range: RANGE,
//             });

//             const allRows = response.result.values || [];

//             // Optional: filter rows by employee code / company code
//             const filteredRows = allRows.filter(
//                 (row) =>
//                     row[0] === empCode.trim() && row[1] === companyCode.trim()
//             );

//             setSheetData(filteredRows);
//         } catch (error) {
//             console.error("Error fetching sheet:", error);
//             alert("Failed to fetch sheet data. Make sure you have access.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://apis.google.com/js/api.js";
//         script.onload = () => {
//             gapi.load("client:auth2", async () => {
//                 await gapi.client.init({
//                     clientId: CLIENT_ID,
//                     discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
//                     scope: SCOPE,
//                 });
//             });
//         };
//         document.body.appendChild(script);
//     }, []);


//     console.log("sheetData", sheetData);


//     return (
//         <div className={styles["page-main"]}>
//             <div className={styles["page-header"]}>Salary Messages</div>
//             <div className={styles["page-contents"]}>
//                 <div className={styles["file-upload"]}>
//                     <div className={styles["file-upload-label"]}>Employee Details</div>
//                     <div className={styles["inputs-wrapper"]}>
//                         <input type="text" placeholder="Employee Code" onChange={(e) => onChangeEmployeeCode(e)} value={empCode} />
//                         <input type="text" placeholder="Company Code" onChange={(e) => onChangeCompanyCode(e)} value={companyCode} />
//                         <div className={styles["submit-button"]} onClick={() => onSubmit()}>{loading ? "Loading..." : "Submit"}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PerformanceSheet