import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";



const NewCutomerDiaLog = ({ openNewCustomerDialog, handleCloseNewCustomerDialog }) => {

    // const handleCreateNewCustomer = () => {
    //     createCustomer({ name: newCustomerName, phone: customerPhone, diem: 0 });
    //     handleCloseNewCustomerDialog();
    // };


    // const handleCloseNewCustomerDialog = () => {
	// 	setOpenNewCustomer(false);
	// 	setOpenNewCustomerDialog(false);
	// };
	// return (
	// 	<Dialog open={openNewCustomerDialog} onClose={handleCloseNewCustomerDialog}>
	// 		<DialogTitle>Tạo Khách Hàng Mới</DialogTitle>
    //         <DialogContent>
	// 				<TextField
	// 					autoFocus
	// 					margin="dense"
	// 					id="name"
	// 					label="Tên khách hàng"
	// 					type="text"
	// 					fullWidth
	// 					variant="outlined"
	// 					value={newCustomerName}
	// 					onChange={(e) => setNewCustomerName(e.target.value)}
	// 				/>
	// 				<TextField
	// 					margin="dense"
	// 					id="phone"
	// 					label="Số điện thoại"
	// 					type="tel"
	// 					fullWidth
	// 					variant="outlined"
	// 					value={customerPhone}
	// 					disabled
	// 				/>
	// 			</DialogContent>
	// 			<DialogActions>
	// 				<Button onClick={handleCloseNewCustomerDialog}>Hủy</Button>
	// 				<Button onClick={handleCreateNewCustomer}>Tạo mới</Button>
	// 			</DialogActions>
	// 	</Dialog>
	// ); 
}

export default NewCutomerDiaLog;
