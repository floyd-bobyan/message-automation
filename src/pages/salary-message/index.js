import { useEffect, useState } from "react"

import { Table } from "antd"
import { IoCopy } from "react-icons/io5";

import styles from "./styles.module.scss"
import { excelToJson } from "../../helpers/excel-helper/json"

const messageStructure = [
  {
    title: "Basic Info",
    fields: [
      "Driver ID",
      "Driver Name",
      "Contract Name"
    ]
  },
  {
    title: "Orders",
    fields: [
      "Total Pickup Orders (Talabat)",
      "Total Dropoff Orders (Talabat)",
      "Multiple Orders (Talabat)"
    ]
  },
  {
    title: "Earnings",
    fields: [
      "Per Order Amount",
      "Bonus Orders",
      "Salary (Talabat)",
      "Salary Rate Bonus",
      "Multiple Orders Bonus",
      "Two Years Bonus",
      "Probation Period Bonus",
      "Incentive"
    ]
  },
  {
    title: "Deductions",
    fields: [
      "Deduction Payable",
      "Petrol",
      "Gross Salary",
      "Sales Cash Penalty",
      "DG Deduction",
      "Batch Penalty",
      "Salary Advance",
      "Negative Salary Deduction",
      "Bike Service Charges Deduction",
      "Talabat MO Deduction",
      "Talabat Deduction",
      "Total Deductions"
    ]
  },
  {
    title: "Final",
    fields: ["Net Salary"]
  }
];

export const formatSalaryAndOrders = (data) => {
    const salarySections = [
        { label: "Salary (Talabat)", value: data.talabatSalary },
        { label: "Salary (Jahez)", value: data.jahezSalary },
        { label: "Salary (Ninja)", value: data.ninjaSalary },
        { label: "Salary (IW-Express)", value: data.iwExpressSalary },
        { label: "Salary (Keeta)", value: data.keetaSalary },
    ]
        .filter(item => item.value && item.value !== 0)
        .map(item => `*${item.label}:* ${item.value}`);

    const orderSections = [
        { label: "Total Pickup Orders (Talabat)", value: data.talabatPickup },
        { label: "Total Dropoff Orders (Talabat)", value: data.talabatDropoff },
        { label: "Multiple Orders (Talabat)", value: data.talabatMultiple },
        { label: "Total Orders (Jahez)", value: data.jahezOrders },
        { label: "Total Orders (Ninja)", value: data.ninjaOrders },
        { label: "Total Orders (IW Express)", value: data.iwExpressOrders },
        { label: "Total Orders (Keeta)", value: data.keetaOrders },
    ]
        .filter(item => item.value && item.value !== 0)
        .map(item => `*${item.label}:* ${item.value}`);

    // Add spacing between sections
    const formattedText = [
        "📊 *Salary Details:*",
        ...salarySections,
        "",
        "📦 *Order Summary:*",
        ...orderSections,
    ]
        .filter(Boolean)
        .join("\n");

    return formattedText;
};

const SalaryMessage = () => {
    const [loading, setLoading] = useState(false);
    const [sheetName, setSheetName] = useState("");
    const [data, setData] = useState([]);
    const [finalData, setFinalData] = useState([]);

    const onChangeSheetName = (e) => {
        setSheetName(e?.target?.value)
    }

    const handleSend = (record) => {
        const phone = record["Contact Number"] || record["Mobile"] || "";
        if (!phone) return alert("No phone number found!");

        const message = encodeURIComponent(record.message);
        const url = `https://wa.me/+965${phone}?text=${message}`;

        const popup = window.open(
            url,
            "whatsappPopup",
            "width=450,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
        );

        // 🕒 Auto-close after 3 seconds
        if (popup) {
            setTimeout(() => {
                popup.close();
            }, 3000);
        }
    };


    const handleUpload = async (e) => {
        setLoading(true)

        const file = e.target.files[0];
        if (!file) return;
        console.log(e);


        const jsonData = await excelToJson({ file: file, sheetName: "" });
        setData(jsonData);
    };

    const tableColumns = [
        {
            title: 'Driver ID',
            dataIndex: 'Driver ID',
            key: 'Driver ID',
        },
        {
            title: 'Driver Name',
            dataIndex: 'Driver Name',
            key: 'Driver Name',
        },
        {
            title: 'Contact Number',
            dataIndex: 'Contact Number',
            key: 'Contact Number',
        },
        {
            title: 'Gross Salary',
            dataIndex: 'Gross Salary',
            key: 'Gross Salary',
        },
        {
            title: 'Total Deductions',
            dataIndex: 'Total Deductions',
            key: 'Total Deductions',
        },
        {
            title: 'Net Salary',
            dataIndex: 'Net Salary',
            key: 'Net Salary',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (_, record) => (
                <div className={styles["message-wrapper"]}>
                    <div
                        dangerouslySetInnerHTML={{ __html: record?.message.replace(/\n/g, "<br/>") }}
                    />
                    <IoCopy className={styles["copy-icon"]} onClick={() => navigator.clipboard.writeText(record?.message)} />
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <button
                    type="primary"
                    style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
                    onClick={() => handleSend(record)}
                >
                    💬 Send
                </button>
            ),
        },
    ];

    // useEffect(() => {
    //     if (data?.length > 0) {
    //         const structuredData = data?.map((item) => ({
    //             ...item,
    //             key: item["Driver ID"],
    //             message: "dummy message"
    //         }))

    //         console.log(structuredData);


    //         setLoading(false)
    //         setFinalData(structuredData)
    //     }
    // }, [data])


    // useEffect(() => {
    //     if (data?.length > 0) {
    //         const structuredData = data.map((item) => {
    //             const driverName = item["Driver Name"] || "Driver";

    //             // Exclude first two columns: S. No and Driver ID
    //             const entries = Object.entries(item).filter(
    //                 ([key]) => key !== "S. No" && key !== "Driver ID"
    //             );

    //             // Build message
    //             const details = entries
    //                 .map(([key, value]) => `*${key}:* ${value ?? ""}`)
    //                 .join("\n");

    //             const message = `Hi ${driverName},\n\nHere are your salary details:\n\n${details}\n\nThank you for your service!`;

    //             return {
    //                 ...item,
    //                 key: item["Driver ID"],
    //                 message,
    //             };
    //         });

    //         setLoading(false);
    //         setFinalData(structuredData);
    //     }
    // }, [data]);

    // useEffect(() => {
    //     if (data?.length > 0) {
    //         const structuredData = data.map((item) => {
    //             const driverName = item["Driver Name"] || "Driver";

    //             let message = `Hi ${driverName},\n\nHere’s your salary details:\n\n`;

    //             messageStructure.forEach((section, index) => {
    //                 section.fields.forEach((field) => {
    //                     if (item[field] !== undefined) {
    //                         message += `*${field}:* ${item[field] ?? ""}\n`;
    //                     }
    //                 });
    //                 message += "\n"; // extra line between groups
    //             });

    //             message += "Thank you for your service!";

    //             return {
    //                 ...item,
    //                 key: item["Driver ID"],
    //                 message,
    //             };
    //         });

    //         setLoading(false);
    //         setFinalData(structuredData);
    //     }
    // }, [data]);

    useEffect(() => {
        if (data?.length > 0) {
            const structuredData = data.map((item) => {
                const driverName = item["Driver Name"] || "Driver";

                let message = `Hi ${driverName},\n\nHere’s your salary details:\n\n`;

                messageStructure.forEach((section) => {
                    const sectionLines = section.fields
                        .filter((field) => item[field] !== 0 && item[field] !== undefined && item[field] !== null)
                        .map((field) => {
                            const value = item[field];
                            const formattedValue =
                                typeof value === "number"
                                    ? parseFloat(value.toFixed(3))
                                    : value;
                            return `*${field}:* ${formattedValue}`;
                        });

                    if (sectionLines.length > 0) {
                        message += section.title ? `${section.title}\n` : "";
                        message += sectionLines.join("\n");
                        message += "\n\n";
                    }
                });

                message += "Thank you for your service!";
                message += "\n\n";
                message += "-*Team BOBYAN DELIVERY*";

                return {
                    ...item,
                    key: item["Driver ID"],
                    message,
                };
            });

            setFinalData(structuredData);
            setLoading(false);
        }
    }, [data]);


    return (
        <div className={styles["page-main"]}>
            <div className={styles["page-header"]}>Salary Messages</div>
            <div className={styles["page-contents"]}>
                <div className={styles["file-upload"]}>
                    <div className={styles["file-upload-label"]}>Upload File</div>
                    <div className={styles["inputs-wrapper"]}>
                        <input type="text" placeholder="Enter sheet name" onChange={(e) => onChangeSheetName(e)} value={sheetName} />
                        <div className="file-upload-button">
                            <input type="file" accept=".xlsx, .xls" onChange={(e) => handleUpload(e)} />
                        </div>
                        {loading ? "Loading..." : ""}
                    </div>

                </div>

                <div className={styles["list-table"]}>
                    <Table
                        dataSource={finalData}
                        columns={tableColumns}
                        bordered
                        pagination={{ pageSize: 500 }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SalaryMessage