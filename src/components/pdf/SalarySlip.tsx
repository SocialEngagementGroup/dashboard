import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts if needed, otherwise use default Helvetica
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 0, // Remove default padding to allow full-width header
        fontFamily: 'Helvetica',
    },
    headerContainer: {
        backgroundColor: '#111827', // Dark background for header
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start', // Left align
        alignItems: 'center',
        marginBottom: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    logo: {
        width: 45, // Reduced size
        height: 45, // Reduced size
        objectFit: 'contain',
    },
    companyInfo: {
        marginLeft: 15,
    },
    companyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    companyAddress: {
        fontSize: 9,
        color: '#D1D5DB', // Light gray
    },
    contentContainer: {
        paddingHorizontal: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 5,
        marginTop: 10,
    },
    sectionTitleWithExtraSpace: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 5,
        marginTop: 25, // Extra space before Net Payable
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    gridItem: {
        width: '50%', // 2 columns
        marginBottom: 15,
    },
    label: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 2,
    },
    value: {
        fontSize: 12,
        color: '#111827',
        fontWeight: 'medium',
    },
    // Removed highlightBox style
    totalAmountLabel: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    totalAmountValue: {
        fontSize: 18, // Slightly larger for emphasis
        fontWeight: 'bold',
        color: '#111827',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        // Removed borderTopWidth and padding to remove the line
    },
    signatureBlock: {
        alignItems: 'center',
        width: 200,
    },
    signatureImage: {
        width: 180,
        height: 90,
        objectFit: 'contain',
        marginBottom: -15, // Negative margin to bring it lower/closer to line
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: '#9CA3AF',
        width: '100%',
        marginTop: 0, // Reset margin top as we are using marginBottom on image
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 8,
        color: '#374151',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    disclaimer: {
        fontSize: 8,
        color: '#9CA3AF',
        maxWidth: '60%',
    },
});

interface SalarySlipProps {
    employeeName: string;
    employeeId: string;
    designation?: string;
    paymentType: string;
    monthOrRemarks: string;
    amount: number;
    currency: string;
    paymentDate: string;
    logoSrc: string | Buffer;
    signatureSrc: string | Buffer;
}

export const SalarySlip = ({
    employeeName,
    employeeId,
    designation,
    paymentType,
    monthOrRemarks,
    amount,
    currency,
    paymentDate,
    logoSrc,
    signatureSrc,
}: SalarySlipProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <Image src={logoSrc} style={styles.logo} />
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>Social Engagement Group</Text>
                        <Text style={styles.companyAddress}>7901 4th St N suite 20573, St. Petersburg, FL 33702</Text>
                        <Text style={styles.companyAddress}>communications@socialengagemenetgroup.com</Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Employee Details */}
                <Text style={styles.sectionTitle}>Employee Details</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Employee Name</Text>
                        <Text style={styles.value}>{employeeName}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Employee ID</Text>
                        <Text style={styles.value}>{employeeId}</Text>
                    </View>
                    {designation && (
                        <View style={styles.gridItem}>
                            <Text style={styles.label}>Designation</Text>
                            <Text style={styles.value}>{designation}</Text>
                        </View>
                    )}
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Date Issued</Text>
                        <Text style={styles.value}>{paymentDate}</Text>
                    </View>
                </View>

                {/* Payment Details */}
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Payment Type</Text>
                        <Text style={styles.value}>{paymentType}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>
                            {paymentType === 'Bonus' ? 'Remarks' : 'For the Month of'}
                        </Text>
                        <Text style={styles.value}>{monthOrRemarks}</Text>
                    </View>
                </View>

                {/* Net Payable Amount - Styled like Payment Details */}
                <Text style={styles.sectionTitleWithExtraSpace}>Net Payable Amount</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.totalAmountLabel}>Total Amount</Text>
                        <Text style={styles.totalAmountValue}>
                            {currency} {amount.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.disclaimer}>
                    <Text>This is a computer-generated document and serves as an official proof of payment.</Text>
                    <Text style={{ marginTop: 4 }}>Generated on {new Date().toLocaleString()}</Text>
                </View>
                <View style={styles.signatureBlock}>
                    <Image src={signatureSrc} style={styles.signatureImage} />
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureText}>Authorized Signatory</Text>
                </View>
            </View>
        </Page>
    </Document>
);
