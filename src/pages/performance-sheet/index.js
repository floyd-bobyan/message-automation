import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import GoogleLoginButton from "@/helpers/login/google";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
const RANGE = "Sheet1!A1:C100";

const PerformanceSheet = () => {
  const [empCode, setEmpCode] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState([]);



  const onSubmit = () => {
    setLoading(true);
 
  };

  return (
    <div className={styles["page-main"]}>
      <GoogleLoginButton />

      Yoo
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
            <div className={styles["submit-button"]} onClick={onSubmit}>
              {loading ? "Loading..." : "Submit"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSheet;
