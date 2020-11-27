import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getKotaSeller, updateOngkir, getDataOngkirAPI, getDataDetailedOngkirAPI, updateHargaOngkir, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup,
    InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap'
import { withRouter, Link } from 'react-router-dom';
import readXlsxFile from 'read-excel-file'
import NumberFormat from 'react-number-format';
import Toast from 'light-toast';

class ContentOngkir extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        isOpenInsert: false,
        insert_file: '',
        insert_file_target: '',
        isOpenErrorFileNotFound: false,
        isBtnInsert: true,
        kotaasalseller: '',
        isReadFile: false,
        datakota: [],
        statusUpdate: false,
        allDataOngkir: [],
        empty_harga_ongkir: false,
        isBtnUpdate: true,
        id_ongkir_selected: '',
        nama_kota_selected: '',
        nama_provinsi_selected: '',
        satuan_selected: '',
        harga_selected: '',
        isOpenConfirmUpdate: false
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis),
            sa_role: decrypt(userData.sa_role),
            sa_divisi: decrypt(userData.sa_divisi),
            id_sales_registered: decrypt(userData.id_sales_registered),
            id_company_registered: decrypt(userData.id_company_registered)
        })
    }

    componentDidMount() {
        this.loadKotaSeller()
        this.loadDataOngkir()
    }

    loadKotaSeller = async () => {
        let passquerykotaseller = encrypt("select kota from gcm_master_alamat " +
            "where company_id=" + this.state.company_id + " and flag_active='A' limit 1")
        const reskotaseller = await this.props.getKotaSeller({ query: passquerykotaseller }).catch(err => err)
        if (reskotaseller) {
            this.setState({ kotaasalseller: decrypt(reskotaseller.kota) })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    loadDataOngkir = async () => {
        let passquerydataongkir = encrypt("select gcm_ongkos_kirim.id, gcm_master_city.nama as nama_kota, " +
            "gcm_master_provinsi.nama as nama_provinsi, gcm_ongkos_kirim.satuan, gcm_ongkos_kirim.harga " +
            "from gcm_ongkos_kirim " +
            "inner join gcm_master_city on gcm_ongkos_kirim.tujuan_kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_city.id_provinsi = gcm_master_provinsi.id " +
            "where gcm_ongkos_kirim.id_company=" + this.state.company_id)
        const resdataongkir = await this.props.getDataOngkirAPI({ query: passquerydataongkir }).catch(err => err)
        if (resdataongkir) {
            resdataongkir.map((user, index) => {
                return (
                    resdataongkir[index].satuan =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.satuan}</p>,
                    (resdataongkir[index].harga) === null ?
                        resdataongkir[index].harga =
                        <p className="mb-0" style={{ textAlign: 'right' }}>Ditentukan manual</p>
                        :
                        Number(resdataongkir[index].harga) !== 0 ?
                            resdataongkir[index].harga =
                            <div className="text-right">
                                <NumberFormat value={Number(user.harga)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat>
                            </div>
                            :
                            resdataongkir[index].harga =
                            <p className="mb-0" style={{ textAlign: 'right' }}>Gratis</p>,
                    resdataongkir[index].keterangan =
                    <center>
                        <div>
                            <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                onClick={(e) => this.handleDetailOngkir(e, resdataongkir[index].id)}>Lihat Detail
                                </button>
                        </div>
                    </center>
                )
            })
            this.setState({ allDataOngkir: resdataongkir })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleDetailOngkir = async (e, id) => {
        this.handleModalDetail()
        let passquerydetaileddataongkir = encrypt("select gcm_ongkos_kirim.id, gcm_master_city.nama as nama_kota, " +
            "gcm_master_provinsi.nama as nama_provinsi, gcm_ongkos_kirim.satuan, gcm_ongkos_kirim.harga " +
            "from gcm_ongkos_kirim " +
            "inner join gcm_master_city on gcm_ongkos_kirim.tujuan_kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_city.id_provinsi = gcm_master_provinsi.id " +
            "where gcm_ongkos_kirim.id_company=" + this.state.company_id + " and gcm_ongkos_kirim.id=" + id)
        const resdetailedongkir = await this.props.getDataDetailedOngkirAPI({ query: passquerydetaileddataongkir }).catch(err => err)
        if (resdetailedongkir) {
            this.setState({
                id_ongkir_selected: decrypt(resdetailedongkir.id),
                nama_kota_selected: resdetailedongkir.nama_kota,
                nama_provinsi_selected: resdetailedongkir.nama_kota,
                satuan_selected: resdetailedongkir.satuan,
                harga_selected: Number(resdetailedongkir.harga)
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            empty_harga_ongkir: false,
            isBtnUpdate: true
        })
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            insert_file: '',
            insert_file_target: '',
            isOpenErrorFileNotFound: false,
            isReadFile: false,
            statusUpdate: false,
            isBtnInsert: true
        })
    }

    handleFileInsert = async (e) => {
        if (e.target.value !== '') {
            await this.setState({
                insert_file: URL.createObjectURL(e.target.files[0]),
                insert_file_target: e.target.files[0],
                isBtnInsert: false
            })
        } else if (e.target.value === '') {
            await this.setState({
                insert_file: '',
                insert_file_target: '',
                errormessage: 'Harap pilih berkas yang akan dimasukkan!',
                isOpenErrorFileNotFound: !this.state.isOpenErrorFileNotFound,
                isBtnInsert: true
            })
        }
    }

    handleModalConfirmInsert = async () => {
        if (this.state.insert_file !== '') {
            await this.setState({ isOpenConfirmInsert: !this.state.isOpenConfirmInsert })
        } else {
            await this.setState({
                errormessage: 'Harap pilih berkas yang akan dimasukkan!',
                isOpenErrorFileNotFound: !this.state.isOpenErrorFileNotFound,
                isBtnInsert: true
            })
        }
    }

    confirmActionInsertOngkir = async () => {
        Toast.loading('Loading...');
        await this.readExcel()
        this.setState({ statusUpdate: false })
        let rowFailed = ""
        let passqueryongkir = ""
        for (let i = 0; i < this.state.datakota.length; i++) {
            if (this.state.datakota[i].satuan === null) {
                passqueryongkir = encrypt("select func_change_ongkir (" + this.state.company_id + ", '" +
                    this.state.datakota[i].asal_kota + "', '" + this.state.datakota[i].tujuan_kota + "', " + this.state.datakota[i].satuan + ", " +
                    this.state.datakota[i].harga + ");")
            } else {
                passqueryongkir = encrypt("select func_change_ongkir (" + this.state.company_id + ", '" +
                    this.state.datakota[i].asal_kota + "', '" + this.state.datakota[i].tujuan_kota + "', '" + this.state.datakota[i].satuan + "', " +
                    this.state.datakota[i].harga + ");")
            }
            const resongkir = await this.props.updateOngkir({ query: passqueryongkir }).catch(err => err)
            if (resongkir) {

            } else {
                rowFailed = rowFailed.concat(i + 5)
                if (i < this.state.datakota.length - 1) {
                    rowFailed = rowFailed.concat(', ')
                }
            }
        }
        Toast.hide();
        if (rowFailed === "") {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataOngkir()
                window.location.reload()
            });
        } else {
            swal({
                title: "Kesalahan!",
                text: "Terdapat data yang gagal terunggah pada baris data " + rowFailed + ".\nHarap periksa dan teliti kembali data ongkos kirim.",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                window.location.reload()
            });
        }
    }

    readExcel = async () => {
        await this.setState({ isReadFile: true })
        let dataList = []
        await readXlsxFile(this.state.insert_file_target).then((rows) => {
            for (let i = 4; i < rows.length; i++) {
                let Data = {
                    id_company: this.state.company_id,
                    asal_kota: this.state.kotaasalseller,
                    tujuan_kota: rows[i][1],
                    satuan: rows[i][4],
                    harga: rows[i][5]
                }
                dataList.push(Data)
            }
        })
        // kasih pengecekan filenya bener ga
        await this.setState({ datakota: dataList, isReadFile: false })
    }

    handleChange = async (event) => {
        if (event.target.name === 'harga_selected') {
            this.setState({
                [event.target.name]: event.target.value
            })
            this.check_ongkir(event.target.value)
        }
    }

    check_ongkir = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ errormessage: 'Kolom ini harus diisi', isBtnUpdate: true })
        } else {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ errormessage: '', isBtnUpdate: false })
        }
    }

    handleModalConfirm = () => {
        this.setState({
            isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
        })
    }

    confirmActionUpdateOngkir = async () => {
        Toast.loading('Loading...');
        let passqueryupdateongkir = encrypt("update gcm_ongkos_kirim set harga='" + this.state.harga_selected.split('.').join('').split(',').join('.') + "' " +
            " where id=" + this.state.id_ongkir_selected + " returning id_company;")
        const resupdateongkir = await this.props.updateHargaOngkir({ query: passqueryupdateongkir }).catch(err => err)
        Toast.hide();
        if (resupdateongkir) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataOngkir()
                window.location.reload()
            });
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
            }).then(() => {
                window.location.reload()
            });
        }
    }

    render() {
        const dataOngkir = {
            columns: [
                {
                    label: 'Kota Tujuan',
                    field: 'nama_kota',
                    width: 100
                },
                {
                    label: 'Provinsi Tujuan',
                    field: 'nama_provinsi',
                    width: 100
                },
                {
                    label: 'Satuan',
                    field: 'satuan',
                    width: 100
                },
                {
                    label: 'Harga Ongkir',
                    field: 'harga',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allDataOngkir
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-car icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Ongkir
                                    <div className="page-title-subheading">Daftar ongkos kirim yang tersedia pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data ongkir" onClick={this.handleModalInsert}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        <button className="sm-2 mr-2 btn btn-danger" >
                            <Link
                                to="assets/files/TemplateOngkir.xlsx"
                                target="_blank"
                                download
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    padding: '5px'
                                }}
                            >Unduh template</Link>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <div>
                                        <MDBDataTable
                                            bordered
                                            striped
                                            responsive
                                            hover
                                            data={dataOngkir}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal Insert Ongkir */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Perbarui Ongkir</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <div className="alert alert-danger fade show text-center" role="alert">
                                <center>
                                    <p className="mb-0">Pastikan berkas yang diunggah sesuai dengan </p>
                                    <p className="mb-0">format berkas ongkir yang ditentukan oleh GLOB.</p>
                                    {/* <p className="mb-0">Proses ini membutuhkan koneksi internet yang stabil</p>
                                    <p className="mb-0">untuk menghindari kegagalan unggah data ongkir.</p> */}
                                </center>
                            </div>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Unggah Berkas Ongkir (.xlsx)</p>
                                {/* xlsx */}
                                <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={this.handleFileInsert} style={{ marginTop: '5%' }}></Input>
                                {/* xls */}
                                {/* <Input type="file" accept="application/vnd.ms-excel" className="insert-gambar"
                                    onChange={this.handleGambarInsert} style={{marginTop:'5%'}}></Input> */}
                                {/* <FormFeedback>Kolom ini wajib diisi</FormFeedback> */}
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnInsert}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Peringatan Insert Picture Kosong */}
                <Modal size="sm" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenErrorFileNotFound} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Peringatan!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.errormessage}</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Confirm Insert */}
                <Modal size="sm" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenConfirmInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionInsertOngkir}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Ongkir */}
                <Modal size="sm" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Ongkir</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kota Tujuan</p>
                                <p className="mb-0">{this.state.nama_kota_selected}</p>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Provinsi Tujuan</p>
                                <p className="mb-0">{this.state.nama_provinsi_selected}</p>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Ongkir </p>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend" style={{ width: '100%' }}>
                                        <NumberFormat
                                            thousandSeparator='.' value={this.state.harga_selected}
                                            allowNegative={false} decimalSeparator=',' name="harga_selected"
                                            id="harga_selected" onChange={this.handleChange} className="form-control"></NumberFormat>
                                        <InputGroupText>/ {this.state.satuan_selected}</InputGroupText>
                                    </InputGroupAddon>
                                    <div id="errorharga" style={{ display: 'none' }}>
                                        <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                                    </div>
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnUpdate}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update*/}
                <Modal size="sm" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirmUpdate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateOngkir}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    logoutAPI: () => dispatch(logoutUserAPI()),
    getKotaSeller: (data) => dispatch(getKotaSeller(data)),
    getDataOngkirAPI: (data) => dispatch(getDataOngkirAPI(data)),
    getDataDetailedOngkirAPI: (data) => dispatch(getDataDetailedOngkirAPI(data)),
    updateOngkir: (data) => dispatch(updateOngkir(data)),
    updateHargaOngkir: (data) => dispatch(updateHargaOngkir(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentOngkir));