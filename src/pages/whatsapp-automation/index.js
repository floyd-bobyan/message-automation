import { useEffect, useState } from "react"

import { Table } from "antd"
import { IoCopy } from "react-icons/io5";

import styles from "./styles.module.scss"

const AutomationMain = () => {
    const [fileLink, setFileLink] = useState("")
    const [sheetName, setSheetName] = useState("")
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState([])
    const [finalData, setFinalData] = useState([])

    const onChangeFile = ({ file }) => {
        setFileLink(file)
    }

    const onChangeSheet = ({ sheet }) => {
        setSheetName(sheet)
    }
    
    const onSubmit = () => {
        if (!fileLink) return;

        if (!sheetName) {
            alert("Enter Sheet Name")
            return
        }

        setLoading(true);

        const id = fileLink.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (!id) {
            console.error("⚠️ Invalid Google Sheet link");
            setLoading(false);
            return;
        }

        fetch(`https://opensheet.elk.sh/${id}/${sheetName}`)
            .then(res => res.json())
            .then(data => {
                setRawData(data)
            })
            .catch(err => {
                console.error("❌ Error fetching sheet data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // const handleSend = (record) => {
    //     const phone = record["Contact Number"] || record["Mobile"] || "";
    //     if (!phone) return alert("No phone number found!");

    //     const message = encodeURIComponent(record.message);
    //     const url = `https://wa.me/${phone}?text=${message}`;

    //     // Small popup — just enough for WhatsApp Web
    //     window.open(
    //         url,
    //         "whatsappPopup",
    //         "width=450,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    //     );
    // };

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

    const tableColumns = [
        {
            title: 'Rider Name',
            dataIndex: 'Driver Name',
            key: 'Driver Name',
        },
        {
            title: 'Contact Number',
            dataIndex: 'Contact Number',
            key: 'Contact Number',
        },
        {
            title: 'Pending Amount',
            dataIndex: 'Total Pending Amount',
            key: 'Total Pending Amount',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (_, record) => (
                <div className={styles["message-wrapper"]}>
                    <div
                        dangerouslySetInnerHTML={{__html: record?.message.replace(/\n/g, "<br/>")}}
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

    useEffect(() => {
        if (rawData?.length > 0) {
            const filteredData = rawData?.filter(rider => Number(rider["Total Pending Amount"]) > 30)

            const structuredData = filteredData?.map(rider => ({
                ...rider,
                key: rider["'Rider Name'"],
                message: `Final Reminder!!!\n\n` +
                `Hi ${rider["Driver Name"]},\n` +
                    // `You currently have October pending sales cash of *${rider["Total Pending Amount"]}* KWD.\n` +
                    `Please make the deposit *${rider["Total Pending Amount"]}* KD today by *3 PM* to save penalties of 30KD.\n\n` +
                    // `Kindly ignore if you have already deposited.\n\n` +
                    ` — *Team Bobyan*`
            }))

            setFinalData(structuredData || [])
        }
    }, [rawData])

    return (
        <div className={styles["page-main"]}>
            <div className={styles["page-header"]}>Whatsapp Automation</div>
            <div className={styles["page-contents"]}>
                <div className={styles["file-upload"]}>
                    <div className={styles["file-upload-label"]}>Enter File Details</div>
                    <div className={styles["inputs-wrapper"]}>
                        <input className={styles["sheet-input"]} placeholder="Sheet Name" value={sheetName} onChange={(e) => onChangeSheet({ sheet: e?.target?.value })} />
                        <input className={styles["file-input"]} placeholder="Google Sheet Link" value={fileLink} onChange={(e) => onChangeFile({ file: e?.target?.value })} />
                        <div className={styles["submit-button"]} onClick={() => onSubmit()}>{loading ? "Loading..." : "Submit"}</div>
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

export default AutomationMain