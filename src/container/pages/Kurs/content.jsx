import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataKursAdminAPI, insertKursSeller, updateKursSeller, getKursActiveAPIManual, getDataCheckedKurs, getDataDetailedKursAPI, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import DateTime from 'react-datetime';
import Toast from 'light-toast';
import 'moment/locale/id'


class ContentKurs extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allKursListing: [],
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isBtnInsert: true,
        insert_nilai_kurs: '',
        kurs_now_manual: '0',
        create_date_kurs_now_manual: '-',
        update_date_kurs_now_manual: '-',
        tgl_start_kurs_now_manual: '-',
        tgl_end_kurs_now_manual: '-',
        dateMulaiBerlaku: '',
        momentdateMulaiBerlaku: '',
        dateBerakhir: '',
        momentdateBerakhir: '',
        id_kurs_selected: '',
        nilai_kurs_selected: '',
        dateMulaiBerlakuSelected: '',
        momentdateMulaiBerlakuSelected: '',
        dateMulaiBerlakuSelectedForFlag: '',
        dateBerakhirSelected: '',
        dateBerakhirSelectedForFlag: '',
        momentdateBerakhirSelected: '',
        pembandingDateMulaiBerlakuSelected: '',
        pembandingDateBerakhirSelected: '',
        pembandingdateBerakhirSelectedOngoing: '',
        lemparDateMulaiBerlakuSelected: '',
        lemparDateBerakhirSelected: '',
        allCheckedKursAwal: 0,
        allCheckedKursPertama: 0,
        allCheckedKursKedua: 0,
        allCheckedKursKetiga: 0,
        allCheckedKursUpdated: 0,
        isOpenAttentionKurs: false,
        showDateMulaiBerlaku: '',
        showDateBerakhir: '',
        isOpen: false,
        isOpenNotYet: false,
        isbtnupdatekurs: true,
        isOpenConfirmUpdate: false,
        errormessage: '',
        errormessagetglend: '',
        sekarang: '',
        dateBerakhirSelectedOngoing: '',
        momentdateMulaiBerlakuSelectedOngoing: '',
        momentdateBerakhirSelectedOngoing: '',
        isOpenAttentionKursMulaiBerlaku: false,
        isOpenAttentionKursMulaiBerlakuOnGoing: false,
        flagupdate: '0'
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
        this.loadDataKurs()
        this.loadActiveKurs()
    }

    loadDataKurs = async () => {
        // let passquerydatakurs = encrypt("select gcm_listing_kurs.nominal, "+
        //     "to_char(gcm_listing_kurs.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, "+
        //     "to_char(gcm_listing_kurs.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, "+
        //     "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI:SS') tgl_start, "+
        //     "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI:SS') tgl_end "+
        //         "from gcm_listing_kurs "+
        //     "where company_id="+this.state.company_id+" and gcm_listing_kurs.tgl_end is not null "+
        //     "order by gcm_listing_kurs.tgl_start desc")
        let passquerydatakurs = encrypt("select gcm_listing_kurs.id, gcm_listing_kurs.nominal, " +
            "to_char(gcm_listing_kurs.create_date, 'DD/MM/YYYY HH24:MI') create_date, " +
            "to_char(gcm_listing_kurs.update_date, 'DD/MM/YYYY HH24:MI') update_date, " +
            "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI') tgl_start, " +
            "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI') tgl_end, " +
            "case " +
            "when now() >= gcm_listing_kurs.tgl_start and now() <= gcm_listing_kurs.tgl_end then 'true' " +
            "when now() > gcm_listing_kurs.tgl_start and now() > gcm_listing_kurs.tgl_end then 'false' " +
            "when now() < gcm_listing_kurs.tgl_start and now() < gcm_listing_kurs.tgl_end then 'notyet' " +
            "end  as status " +
            "from gcm_listing_kurs " +
            "where company_id=" + this.state.company_id +
            " order by status desc")
        const reslistingkurs = await this.props.getDataKursAdminAPI({ query: passquerydatakurs }).catch(err => err)
        if (reslistingkurs) {
            reslistingkurs.map((user, index) => {
                return (
                    (user.status === 'false') ?
                        reslistingkurs[index].keterangan =
                        <p className="mb-0" style={{ textAlign: 'center' }}>Tidak dapat diubah</p>
                        : (user.status === 'true') ?
                            reslistingkurs[index].keterangan =
                            <center>
                                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                    onClick={(e) => this.handleDetailKurs(e, reslistingkurs[index].id)}>Lihat Detail</button>
                            </center>
                            : reslistingkurs[index].keterangan =
                            <center>
                                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                    onClick={(e) => this.handleDetailKursNotYet(e, reslistingkurs[index].id)}>Lihat Detail</button>
                            </center>,
                    reslistingkurs[index].status =
                    <center>
                        <div className={
                            (user.status === 'true') ? 'mb-2 mr-2 badge badge-success'
                                : (user.status === 'false') ? 'mb-2 mr-2 badge badge-danger'
                                    : 'mb-2 mr-2 badge badge-primary'}>

                            {(user.status === 'true') ? 'Berlaku saat ini'
                                : (user.status === 'false') ? 'Tidak berlaku'
                                    : 'Belum berlaku'}
                        </div>
                    </center>,
                    reslistingkurs[index].create_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.create_date}</p>,
                    reslistingkurs[index].update_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.update_date}</p>,
                    reslistingkurs[index].tgl_start =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.tgl_start}</p>,
                    reslistingkurs[index].tgl_end =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.tgl_end}</p>,
                    reslistingkurs[index].nominal =
                    <p className="mb-0" style={{ textAlign: 'right' }}>{user.nominal}</p>
                )
            })
            this.setState({
                allKursListing: reslistingkurs
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadActiveKurs = async () => {
        // let passquerykursnow = encrypt("select gcm_listing_kurs.nominal, "+
        //     "to_char(gcm_listing_kurs.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, "+
        //     "to_char(gcm_listing_kurs.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, "+
        //     "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI:SS') tgl_start, "+
        //     "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI:SS') tgl_end "+
        //         "from gcm_listing_kurs "+
        //     "where company_id="+this.state.company_id+" and (now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end);")
        let passquerykursnow = encrypt("select gcm_listing_kurs.nominal, " +
            "to_char(gcm_listing_kurs.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
            "to_char(gcm_listing_kurs.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, " +
            "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI:SS') tgl_start, " +
            "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI:SS') tgl_end " +
            "from gcm_listing_kurs " +
            "where company_id=" + this.state.company_id + " and (now() >= gcm_listing_kurs.tgl_start and now() <= gcm_listing_kurs.tgl_end);")
        const reskursnow = await this.props.getKursActiveAPIManual({ query: passquerykursnow }).catch(err => err)
        if (reskursnow) {
            this.setState({
                kurs_now_manual: reskursnow.nominal,
                create_date_kurs_now_manual: reskursnow.create_date,
                update_date_kurs_now_manual: reskursnow.update_date,
                tgl_start_kurs_now_manual: reskursnow.tgl_start,
                tgl_end_kurs_now_manual: reskursnow.tgl_end
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleDetailKurs = async (e, id) => {
        this.handleModalDetailKurs()
        e.stopPropagation()
        let passquerydetailkurs = encrypt("select gcm_listing_kurs.id, gcm_listing_kurs.nominal, " +
            "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI') tgl_start, " +
            "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI') tgl_end, " +
            "to_char(gcm_listing_kurs.tgl_start, 'YYYY-MM-DD HH24:MI') tgl_start_edited, " +
            "to_char(gcm_listing_kurs.tgl_end, 'YYYY-MM-DD HH24:MI') tgl_end_edited, " +
            "gcm_listing_kurs.tgl_start as pure_tgl_start, " +
            "gcm_listing_kurs.tgl_end as pure_tgl_end " +
            "from gcm_listing_kurs where gcm_listing_kurs.id=" + id)
        const resdetailkurs = await this.props.getDataDetailedKursAPI({ query: passquerydetailkurs }).catch(err => err)
        if (resdetailkurs) {
            await this.setState({
                id_kurs_selected: resdetailkurs.id,
                nilai_kurs_selected: Number(resdetailkurs.nominal),
                dateMulaiBerlakuSelectedForFlag: resdetailkurs.tgl_start,
                dateMulaiBerlakuSelected: resdetailkurs.tgl_start_edited,
                momentdateMulaiBerlakuSelected: moment(resdetailkurs.pure_tgl_start, "YYYY-MM-DD HH:mm"),
                dateBerakhirSelectedForFlag: resdetailkurs.tgl_end,
                dateBerakhirSelected: resdetailkurs.tgl_end_edited,
                momentdateBerakhirSelected: moment(resdetailkurs.pure_tgl_end, "YYYY-MM-DD HH:mm"),
                pembandingDateMulaiBerlakuSelected: resdetailkurs.tgl_start,
                pembandingDateBerakhirSelected: resdetailkurs.tgl_end,
                lemparDateMulaiBerlakuSelected: resdetailkurs.pure_tgl_start,
                lemparDateBerakhirSelected: resdetailkurs.pure_tgl_end,
                dateBerakhirSelectedOngoing: resdetailkurs.tgl_end,
                pembandingdateBerakhirSelectedOngoing: resdetailkurs.tgl_end_edited,
                momentdateMulaiBerlakuSelectedOngoing: moment(resdetailkurs.pure_tgl_start, "YYYY-MM-DD HH:mm"),
                momentdateBerakhirSelectedOngoing: moment(resdetailkurs.pure_tgl_end, "YYYY-MM-DD HH:mm"),
                flagupdate: '1'
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleDetailKursNotYet = async (e, id) => {
        this.handleModalDetailKursNotYet()
        e.stopPropagation()
        let passquerydetailkurs = encrypt("select gcm_listing_kurs.id, gcm_listing_kurs.nominal, " +
            "to_char(gcm_listing_kurs.tgl_start, 'DD/MM/YYYY HH24:MI') tgl_start, " +
            "to_char(gcm_listing_kurs.tgl_end, 'DD/MM/YYYY HH24:MI') tgl_end, " +
            "to_char(gcm_listing_kurs.tgl_start, 'YYYY-MM-DD HH24:MI') tgl_start_edited, " +
            "to_char(gcm_listing_kurs.tgl_end, 'YYYY-MM-DD HH24:MI') tgl_end_edited, " +
            "gcm_listing_kurs.tgl_start as pure_tgl_start, " +
            "gcm_listing_kurs.tgl_end as pure_tgl_end " +
            "from gcm_listing_kurs where gcm_listing_kurs.id=" + id)
        const resdetailkurs = await this.props.getDataDetailedKursAPI({ query: passquerydetailkurs }).catch(err => err)
        if (resdetailkurs) {
            await this.setState({
                id_kurs_selected: resdetailkurs.id,
                nilai_kurs_selected: Number(resdetailkurs.nominal),
                dateMulaiBerlakuSelectedForFlag: resdetailkurs.tgl_start,
                dateMulaiBerlakuSelected: resdetailkurs.tgl_start_edited,
                momentdateMulaiBerlakuSelected: moment(resdetailkurs.pure_tgl_start, "YYYY-MM-DD HH:mm"),
                dateBerakhirSelectedForFlag: resdetailkurs.tgl_end,
                dateBerakhirSelected: resdetailkurs.tgl_end_edited,
                momentdateBerakhirSelected: moment(resdetailkurs.pure_tgl_end, "YYYY-MM-DD HH:mm"),
                pembandingDateMulaiBerlakuSelected: resdetailkurs.tgl_start,
                pembandingDateBerakhirSelected: resdetailkurs.tgl_end,
                lemparDateMulaiBerlakuSelected: resdetailkurs.pure_tgl_start,
                lemparDateBerakhirSelected: resdetailkurs.pure_tgl_end,
                dateBerakhirSelectedOngoing: resdetailkurs.tgl_end,
                pembandingdateBerakhirSelectedOngoing: resdetailkurs.tgl_end_edited,
                momentdateMulaiBerlakuSelectedOngoing: moment(resdetailkurs.pure_tgl_start, "YYYY-MM-DD HH:mm"),
                momentdateBerakhirSelectedOngoing: moment(resdetailkurs.pure_tgl_end, "YYYY-MM-DD HH:mm"),
                flagupdate: '2'
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleModalDetailKurs = async () => {
        await this.setState({
            isOpen: !this.state.isOpen,
            id_kurs_selected: '',
            nilai_kurs_selected: '',
            dateMulaiBerlakuSelected: '',
            dateMulaiBerlakuSelectedForFlag: '',
            momentdateMulaiBerlakuSelected: '',
            dateBerakhirSelected: '',
            dateBerakhirSelectedForFlag: '',
            momentdateBerakhirSelected: '',
            errormessage: '',
            errormessagetglend: '',
            lemparDateMulaiBerlakuSelected: '',
            lemparDateBerakhirSelected: '',
            dateBerakhirSelectedOngoing: '',
            pembandingdateBerakhirSelectedOngoing: '',
            momentdateMulaiBerlakuSelectedOngoing: '',
            momentdateBerakhirSelectedOngoing: '',
            sekarang: moment().format("DD/MM/YYYY HH:mm"),
            isbtnupdatekurs: true,
            allCheckedKursAwal: 0,
            allCheckedKursPertama: 0,
            allCheckedKursKedua: 0,
            allCheckedKursKetiga: 0,
            flagupdate: '0'
        })
    }

    handleModalDetailKursNotYet = async () => {
        await this.setState({
            isOpenNotYet: !this.state.isOpenNotYet,
            id_kurs_selected: '',
            nilai_kurs_selected: '',
            dateMulaiBerlakuSelected: '',
            dateMulaiBerlakuSelectedForFlag: '',
            momentdateMulaiBerlakuSelected: '',
            dateBerakhirSelected: '',
            dateBerakhirSelectedForFlag: '',
            momentdateBerakhirSelected: '',
            errormessage: '',
            errormessagetglend: '',
            lemparDateMulaiBerlakuSelected: '',
            lemparDateBerakhirSelected: '',
            dateBerakhirSelectedOngoing: '',
            pembandingdateBerakhirSelectedOngoing: '',
            momentdateMulaiBerlakuSelectedOngoing: '',
            momentdateBerakhirSelectedOngoing: '',
            sekarang: moment().format("DD/MM/YYYY HH:mm"),
            isbtnupdatekurs: true,
            allCheckedKursAwal: 0,
            allCheckedKursPertama: 0,
            allCheckedKursKedua: 0,
            allCheckedKursKetiga: 0,
            flagupdate: '0'
        })
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            isBtnInsert: true,
            insert_nilai_kurs: '',
            dateMulaiBerlaku: '',
            momentdateMulaiBerlaku: '',
            dateBerakhir: '',
            momentdateBerakhir: '',
            errormessage: '',
            errormessagetglend: ''
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'insert_nilai_kurs') {
            this.check_kurs(event.target.value)
        }
        if (event.target.name === 'nilai_kurs_selected') {
            this.check_kurs_updated(event.target.value)
        }
    }

    check_kurs = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ errormessage: 'Kolom ini harus diisi', isBtnInsert: true })
        } else {
            if (x === '0') {
                document.getElementById('errorharga').style.display = 'block'
                this.setState({ errormessage: 'Kolom ini tidak boleh bernilai 0', isBtnInsert: true })
            } else {
                document.getElementById('errorharga').style.display = 'none'
                let passdateawal = moment(this.state.dateMulaiBerlaku).format("YYYY-MM-DD HH:mm:ss")
                let passdateberakhir = moment(this.state.dateBerakhir).format("YYYY-MM-DD HH:mm:ss")
                if (this.state.dateMulaiBerlaku !== '' && this.state.dateBerakhir !== '' &&
                    passdateawal !== passdateberakhir && passdateawal < passdateberakhir &&
                    this.state.dateMulaiBerlaku !== undefined && this.state.dateBerakhir !== undefined) {
                    this.setState({ isBtnInsert: false })
                } else {
                    this.setState({ isBtnInsert: true })
                }
            }
        }
    }

    check_kurs_updated = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ errormessage: 'Kolom ini harus diisi', isbtnupdatekurs: true })
        } else {
            if (x === '0') {
                document.getElementById('errorharga').style.display = 'block'
                this.setState({ errormessage: 'Kolom ini tidak boleh bernilai 0', isbtnupdatekurs: true })
            } else {
                document.getElementById('errorharga').style.display = 'none'
                let passdateawal = moment(this.state.dateMulaiBerlakuSelected).format("YYYY-MM-DD HH:mm:ss")
                let passdateberakhir = moment(this.state.dateBerakhirSelected).format("YYYY-MM-DD HH:mm:ss")
                if (this.state.dateMulaiBerlakuSelected !== '' && this.state.dateBerakhirSelected !== '' &&
                    passdateawal !== passdateberakhir && passdateawal < passdateberakhir &&
                    this.state.dateMulaiBerlakuSelected !== undefined && this.state.dateBerakhirSelected !== undefined) {
                    this.setState({ isbtnupdatekurs: false })
                } else {
                    this.setState({ isbtnupdatekurs: true })
                }
            }
        }
    }

    handleModalConfirmInsert = async () => {
        let passdateawal = moment(this.state.dateMulaiBerlaku).format("YYYY-MM-DD HH:mm:ss")
        let passdateberakhir = moment(this.state.dateBerakhir).format("YYYY-MM-DD HH:mm:ss")
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        this.setState({ showDateMulaiBerlaku: passdateawal, showDateBerakhir: passdateberakhir })
        await this.checkingkursawal(passdateawal, passdateberakhir)
        if (Number(this.state.allCheckedKursAwal) > 0) {
            this.handleModalAttentionKurs()
        } else {
            await this.checkingdatakurs(passdateawal, passdateberakhir)
            // console.log("pertama", this.state.allCheckedKursPertama)
            // console.log("kedua", this.state.allCheckedKursKedua)
            // console.log("ketiga", this.state.allCheckedKursKetiga)
            if (now > passdateawal) {
                this.handleModalAttentionKursMulaiBerlaku()
            } else {
                if (this.state.allCheckedKursPertama > 0) {
                    this.handleModalAttentionKurs()
                } else {
                    if (Number(this.state.allCheckedKursKetiga) > 0) {
                        this.handleModalAttentionKurs()
                    } else {
                        this.setState({ isOpenConfirmInsert: !this.state.isOpenConfirmInsert })
                    }
                }
            }
        }
    }

    checkingkursawal = async (passdateawal, passdateberakhir) => {
        let passquerycheckingkursawal = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id +
            " and (('" + passdateawal + "' >= tgl_start and '" + passdateawal + "' <= tgl_end) " +
            "and ('" + passdateberakhir + "' >= tgl_start and '" + passdateberakhir + "' <= tgl_end))")
        const residcheckedawal = await this.props.getDataCheckedKurs({ query: passquerycheckingkursawal }).catch(err => err)
        if (residcheckedawal) {
            await this.setState({
                allCheckedKursAwal: Number(residcheckedawal.total)
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    checkingdatakurs = async (passdateawal, passdateberakhir) => {
        let passquerycheckingkurspertama = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id +
            " and (('" + passdateberakhir + "' > tgl_start and tgl_start > now() and '" + passdateberakhir + "' < tgl_end) " +
            "or ('" + passdateawal + "' < tgl_end and tgl_end < now()))")
        const residcheckedpertama = await this.props.getDataCheckedKurs({ query: passquerycheckingkurspertama }).catch(err => err)
        if (residcheckedpertama) {
            await this.setState({
                allCheckedKursPertama: Number(residcheckedpertama.total)
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
        if (Number(this.state.allCheckedKursPertama) > 0) {

        } else {
            let passquerycheckingkurskedua = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id +
                " and tgl_end = '" + passdateawal + "' or tgl_start = '" + passdateberakhir + "'")
            const residcheckedkedua = await this.props.getDataCheckedKurs({ query: passquerycheckingkurskedua }).catch(err => err)
            if (residcheckedkedua) {
                await this.setState({
                    allCheckedKursKedua: Number(residcheckedkedua.total)
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
                    const res = this.props.logoutAPI();
                    if (res) {
                        this.props.history.push('/admin')
                        window.location.reload()
                    }
                });
            }
            let passquerycheckingkursketiga = ""
            if (Number(this.state.allCheckedKursKedua) > 0) {
                passquerycheckingkursketiga = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id +
                    " and ((tgl_start >= '" + passdateawal + "' and tgl_start <= '" + passdateberakhir + "')" +
                    " and (tgl_end >= '" + passdateawal + "' and tgl_end <= '" + passdateberakhir + "'))")
            } else {
                passquerycheckingkursketiga = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id +
                    " and ((tgl_start >= '" + passdateawal + "' and tgl_start <= '" + passdateberakhir + "')" +
                    " or (tgl_end >= '" + passdateawal + "' and tgl_end <= '" + passdateberakhir + "'))")
            }
            const residcheckedketiga = await this.props.getDataCheckedKurs({ query: passquerycheckingkursketiga }).catch(err => err)
            if (residcheckedketiga) {
                await this.setState({
                    allCheckedKursKetiga: Number(residcheckedketiga.total)
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
                    const res = this.props.logoutAPI();
                    if (res) {
                        this.props.history.push('/admin')
                        window.location.reload()
                    }
                });
            }
        }
    }

    checkingdatakursupdated = async (passdateawal, passdateberakhir) => {
        let passquerycheckingkurs = encrypt("select count(id) as total from gcm_listing_kurs where company_id=" + this.state.company_id + " and " +
            "(('" + passdateawal + "' between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end) or " +
            "('" + passdateberakhir + "' between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end));")
        const residchecked = await this.props.getDataCheckedKurs({ query: passquerycheckingkurs }).catch(err => err)
        if (residchecked) {
            await this.setState({
                allCheckedKursUpdated: Number(residchecked.total)
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleModalAttentionKurs = () => {
        this.setState({ isOpenAttentionKurs: !this.state.isOpenAttentionKurs })
    }

    handleModalAttentionKursMulaiBerlaku = () => {
        this.setState({ isOpenAttentionKursMulaiBerlaku: !this.state.isOpenAttentionKursMulaiBerlaku })
    }

    handleModalAttentionKursMulaiBerlakuOnGoing = (ref) => {
        if (ref === 'refresh') {
            window.location.reload()
        }
        this.setState({ isOpenAttentionKursMulaiBerlakuOnGoing: !this.state.isOpenAttentionKursMulaiBerlakuOnGoing })
    }

    confirmActionInsertKurs = async () => {
        let passdateawal = moment(this.state.dateMulaiBerlaku).format("YYYY-MM-DD HH:mm:ss")
        let passdateberakhir = moment(this.state.dateBerakhir).format("YYYY-MM-DD HH:mm:ss")
        let passqueryinsertkurs = encrypt("insert into gcm_listing_kurs(nominal, company_id, create_date, update_date, create_by, update_by, tgl_start, tgl_end)" +
            "values ('" + this.state.insert_nilai_kurs.split('.').join('').split(',').join('.') + "', " +
            "'" + this.state.company_id + "', now(), now(), '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', " +
            "'" + passdateawal + "', '" + passdateberakhir + "') returning nominal")

        Toast.loading('Loading...');
        const resinsertkurs = await this.props.insertKursSeller({ query: passqueryinsertkurs }).catch(err => err)
        Toast.hide();

        if (resinsertkurs) {
            swal({
                title: "Sukses!",
                text: "Kurs berhasil ditambahkan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                window.location.reload()
            });
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    confirmActionUpdateKurs = async () => {
        let passqueryupdatekurs = ""
        if (this.state.pembandingDateBerakhirSelected !== this.state.dateBerakhirSelectedOngoing) {
            let passdateberakhir = moment(this.state.dateBerakhirSelectedOngoing).format("YYYY-MM-DD HH:mm:ss")
            passqueryupdatekurs = encrypt("update gcm_listing_kurs set nominal='" + this.state.nilai_kurs_selected.toString().split('.').join('').split(',').join('.') +
                "', company_id='" + this.state.company_id + "', update_date=now(), update_by='" + this.state.id_pengguna_login + "', " +
                "tgl_end='" + passdateberakhir + "' where gcm_listing_kurs.id=" + this.state.id_kurs_selected + " returning nominal;")
        } else if (this.state.dateMulaiBerlakuSelectedForFlag === this.state.pembandingDateMulaiBerlakuSelected &&
            this.state.dateBerakhirSelectedForFlag === this.state.pembandingDateBerakhirSelected) {
            passqueryupdatekurs = encrypt("update gcm_listing_kurs set nominal='" + this.state.nilai_kurs_selected.toString().split('.').join('').split(',').join('.') +
                "', company_id='" + this.state.company_id + "', update_date=now(), update_by='" + this.state.id_pengguna_login + "', tgl_start='" +
                this.state.lemparDateMulaiBerlakuSelected + "', tgl_end='" + this.state.lemparDateBerakhirSelected + "' where gcm_listing_kurs.id=" + this.state.id_kurs_selected + " returning nominal;")
        } else if (this.state.dateMulaiBerlakuSelectedForFlag === this.state.pembandingDateMulaiBerlakuSelected) {
            let passdateberakhir = moment(this.state.dateBerakhirSelectedForFlag).format("YYYY-MM-DD HH:mm:ss")
            passqueryupdatekurs = encrypt("update gcm_listing_kurs set nominal='" + this.state.nilai_kurs_selected.toString().split('.').join('').split(',').join('.') +
                "', company_id='" + this.state.company_id + "', update_date=now(), update_by='" + this.state.id_pengguna_login + "', tgl_start='" +
                this.state.lemparDateMulaiBerlakuSelected + "', tgl_end='" + passdateberakhir + "' where gcm_listing_kurs.id=" + this.state.id_kurs_selected + " returning nominal;")
        } else {
            let passdateawal = moment(this.state.dateMulaiBerlakuSelectedForFlag).format("YYYY-MM-DD HH:mm:ss")
            let passdateberakhir = moment(this.state.dateBerakhirSelectedForFlag).format("YYYY-MM-DD HH:mm:ss")
            passqueryupdatekurs = encrypt("update gcm_listing_kurs set nominal='" + this.state.nilai_kurs_selected.toString().split('.').join('').split(',').join('.') +
                "', company_id='" + this.state.company_id + "', update_date=now(), update_by='" + this.state.id_pengguna_login + "', tgl_start='" +
                passdateawal + "', tgl_end='" + passdateberakhir + "' where gcm_listing_kurs.id=" + this.state.id_kurs_selected + " returning nominal;")
        }

        Toast.loading('Loading...');
        const resupdatekurs = await this.props.updateKursSeller({ query: passqueryupdatekurs }).catch(err => err)
        Toast.hide()

        if (resupdatekurs) {
            swal({
                title: "Sukses!",
                text: "Kurs berhasil diperbarui!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                window.location.reload()
            });
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }


    }

    handleChangeTimeMulaiBerlaku = async (e) => {
        await this.setState({ dateMulaiBerlaku: e._d, momentdateMulaiBerlaku: e, dateBerakhir: '', momentdateBerakhir: '' })
        let passdateawal = moment(this.state.dateMulaiBerlaku).format("YYYY-MM-DD HH:mm:ss")
        let passdateberakhir = moment(this.state.dateBerakhir).format("YYYY-MM-DD HH:mm:ss")
        if (this.state.dateMulaiBerlaku === undefined) {
            this.setState({ isBtnInsert: true })
        } else {
            if (this.state.insert_nilai_kurs !== '' && this.state.dateMulaiBerlaku !== '' && this.state.dateBerakhir !== '' &&
                passdateawal !== passdateberakhir && passdateawal < passdateberakhir) {
                this.setState({ isBtnInsert: false })
            } else {
                this.setState({ isBtnInsert: true })
            }
        }
    }

    handleChangeTimeBerakhir = async (e) => {
        await this.setState({ dateBerakhir: e._d, momentdateBerakhir: e })
        let passdateawal = moment(this.state.dateMulaiBerlaku).format("YYYY-MM-DD HH:mm:ss")
        let passdateberakhir = moment(this.state.dateBerakhir).format("YYYY-MM-DD HH:mm:ss")
        if (this.state.dateBerakhir === undefined) {
            this.setState({ isBtnInsert: true })
        } else {
            if (this.state.insert_nilai_kurs !== '' && this.state.dateMulaiBerlaku !== '' && this.state.dateBerakhir !== '' &&
                passdateawal !== passdateberakhir && passdateawal < passdateberakhir) {
                this.setState({ isBtnInsert: false })
            } else {
                this.setState({ isBtnInsert: true })
            }
        }
    }

    handleChangeTimeMulaiBerlakuSelected = async (e) => {
        await this.setState({
            dateMulaiBerlakuSelected: e._d, momentdateMulaiBerlakuSelected: e,
            dateMulaiBerlakuSelectedForFlag: e._d, dateBerakhirSelectedForFlag: '',
            dateBerakhirSelected: '', momentdateBerakhirSelected: ''
        })
        let passdateawal = moment(this.state.dateMulaiBerlakuSelected).format("YYYY-MM-DD HH:mm")
        let passdateberakhir = moment(this.state.dateBerakhirSelected).format("YYYY-MM-DD HH:mm")
        if (this.state.dateMulaiBerlakuSelected === undefined) {
            this.setState({ isbtnupdatekurs: true })
        } else {
            if (this.state.nilai_kurs_selected !== '' && this.state.dateMulaiBerlakuSelected !== '' && this.state.dateBerakhirSelected !== '' &&
                passdateawal !== passdateberakhir && passdateawal < passdateberakhir) {
                this.setState({ isbtnupdatekurs: false })
            } else {
                this.setState({ isbtnupdatekurs: true })
            }
        }
    }

    handleChangeTimeBerakhirSelected = async (e) => {
        await this.setState({
            dateBerakhirSelected: e._d, momentdateBerakhirSelected: e,
            dateBerakhirSelectedForFlag: e._d
        })
        let passdateawal = moment(this.state.momentdateMulaiBerlakuSelected).format("YYYY-MM-DD HH:mm")
        let passdateberakhir = moment(this.state.dateBerakhirSelected).format("YYYY-MM-DD HH:mm")
        if (this.state.dateBerakhirSelected === undefined) {
            this.setState({ isbtnupdatekurs: true })
        } else {
            if (this.state.nilai_kurs_selected !== '' && this.state.dateMulaiBerlakuSelected !== '' && this.state.dateBerakhirSelected !== '' &&
                passdateawal !== passdateberakhir && passdateawal < passdateberakhir) {
                this.setState({ isbtnupdatekurs: false })
            } else {
                this.setState({ isbtnupdatekurs: true })
            }
        }
    }

    handleChangeTimeBerakhirSelectedOnGoing = async (e) => {
        await this.setState({ dateBerakhirSelectedOngoing: e._d, momentdateBerakhirSelectedOngoing: e })
        let passdateawal = this.state.dateMulaiBerlakuSelected
        let passdateberakhir = moment(this.state.dateBerakhirSelectedOngoing).format("YYYY-MM-DD HH:mm")
        // console.log("mulaiberlakuforflag", this.state.dateMulaiBerlakuSelectedForFlag)
        // console.log("berakhirforflag", this.state.dateBerakhirSelectedForFlag)
        // console.log("passdateawal", passdateawal)
        // console.log("passdateberakhir", passdateberakhir)
        if (this.state.dateBerakhirSelectedForFlag === undefined) {
            this.setState({ isbtnupdatekurs: true })
        } else {
            if (this.state.nilai_kurs_selected !== '' && this.state.dateMulaiBerlakuSelectedForFlag !== '' &&
                this.state.dateBerakhirSelectedForFlag !== '' &&
                passdateawal !== passdateberakhir && passdateawal < passdateberakhir) {
                this.setState({ isbtnupdatekurs: false })
            } else {
                this.setState({ isbtnupdatekurs: true })
            }
        }
    }

    validationDateMulaiBerlaku = (current) => {
        let yesterday = moment().subtract(1, 'days')
        return current.isAfter(yesterday)
    }

    validationDateBerakhir = (currentberakhir) => {
        let dateMulaiBerlaku = moment(this.state.dateMulaiBerlaku).subtract(1, 'days')
        return currentberakhir.isAfter(dateMulaiBerlaku)
    }

    validationDateMulaiBerlakuSelected = (current) => {
        let yesterday = moment(this.state.lemparDateMulaiBerlakuSelected).subtract(1, 'days')
        // let yesterday = moment()
        return current.isAfter(yesterday)
    }

    validationDateBerakhirSelected = (currentberakhir) => {
        let dateMulaiBerlakuSelected = moment(this.state.momentdateMulaiBerlakuSelected).subtract(1, 'days')
        // let dateMulaiBerlakuSelected = moment(this.state.momentdateMulaiBerlakuSelected)
        return currentberakhir.isAfter(dateMulaiBerlakuSelected)
    }

    validationDateBerakhirSelectedOnGoing = (currentberakhir) => {
        let dateMulaiBerlakuSelected = moment().subtract(1, 'days')
        // let dateMulaiBerlakuSelected = moment()
        return currentberakhir.isAfter(dateMulaiBerlakuSelected)
    }

    handleModalConfirmUpdate = async () => {
        let passdateawal = moment(this.state.dateMulaiBerlakuSelected).format("YYYY-MM-DD HH:mm:ss")
        let passdateberakhir = moment(this.state.dateBerakhirSelected).format("YYYY-MM-DD HH:mm:ss")
        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        let passdateberakhirongoing = moment(this.state.dateBerakhirSelectedOngoing).format("YYYY-MM-DD HH:mm")
        // console.log("passdateberakhirongoing", passdateberakhirongoing)
        this.setState({ showDateMulaiBerlaku: passdateawal, showDateBerakhir: passdateberakhir })
        if (this.state.pembandingDateBerakhirSelected !== moment(this.state.dateBerakhirSelectedOngoing).format("YYYY-MM-DD HH:mm")
            && moment(this.state.dateBerakhirSelectedOngoing).format("YYYY-MM-DD HH:mm") !== 'Invalid date' && this.state.flagupdate === '1') {
            this.setState({ showDateMulaiBerlaku: passdateawal, showDateBerakhir: passdateberakhirongoing })
            await this.checkingkursawal(passdateawal, passdateberakhirongoing)
            if (Number(this.state.allCheckedKursAwal) > 0) {
                if (Number(this.state.allCheckedKursAwal) > 1) {
                    this.handleModalAttentionKurs()
                } else {
                    await this.checkingdatakurs(passdateawal, passdateberakhirongoing)
                    // console.log("pertamaif", this.state.allCheckedKursPertama)
                    // console.log("keduaif", this.state.allCheckedKursKedua)
                    // console.log("ketigaif", this.state.allCheckedKursKetiga)
                    if (now > passdateberakhirongoing) {
                        this.handleModalAttentionKursMulaiBerlakuOnGoing()
                    } else {
                        if (this.state.allCheckedKursPertama > 1) {
                            this.handleModalAttentionKurs()
                        } else {
                            if (Number(this.state.allCheckedKursKetiga) > 1) {
                                this.handleModalAttentionKurs()
                            } else {
                                this.setState({ isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate })
                            }
                        }
                    }
                }
            } else {
                await this.checkingdatakurs(passdateawal, passdateberakhirongoing)
                // console.log("pertama", this.state.allCheckedKursPertama)
                // console.log("kedua", this.state.allCheckedKursKedua)
                // console.log("ketiga", this.state.allCheckedKursKetiga)
                if (now > passdateberakhirongoing) {
                    this.handleModalAttentionKursMulaiBerlakuOnGoing()
                } else {
                    if (this.state.allCheckedKursPertama > 0) {
                        this.handleModalAttentionKurs()
                    } else {
                        if (Number(this.state.allCheckedKursKetiga) > 0) {
                            this.handleModalAttentionKurs()
                        } else {
                            this.setState({ isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate })
                        }
                    }
                }
            }
        } else {
            await this.checkingkursawal(passdateawal, passdateberakhir)
            if (Number(this.state.allCheckedKursAwal) > 0) {
                if (Number(this.state.allCheckedKursAwal) > 1) {
                    this.handleModalAttentionKurs()
                } else {
                    await this.checkingdatakurs(passdateawal, passdateberakhir)
                    if (now > passdateawal) {
                        this.handleModalAttentionKursMulaiBerlaku()
                    } else {
                        if (this.state.allCheckedKursPertama > 1) {
                            this.handleModalAttentionKurs()
                        } else {
                            if (Number(this.state.allCheckedKursKetiga) > 1) {
                                this.handleModalAttentionKurs()
                            } else {
                                this.setState({ isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate })
                            }
                        }
                    }
                }
            } else {
                await this.checkingdatakurs(passdateawal, passdateberakhir)
                if (now > passdateawal) {
                    this.handleModalAttentionKursMulaiBerlaku()
                } else {
                    if (this.state.allCheckedKursPertama > 0) {
                        this.handleModalAttentionKurs()
                    } else {
                        if (Number(this.state.allCheckedKursKetiga) > 1) {
                            this.handleModalAttentionKurs()
                        } else {
                            this.setState({ isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate })
                        }
                    }
                }
            }
        }
    }

    render() {
        const dataKursListing = {
            columns: [
                {
                    label: 'Nominal',
                    field: 'nominal',
                    width: 100
                },
                {
                    label: 'Tanggal Pembuatan',
                    field: 'create_date',
                    width: 100
                },
                {
                    label: 'Tanggal Mulai Berlaku',
                    field: 'tgl_start',
                    width: 150
                },
                {
                    label: 'Tanggal Berakhir',
                    field: 'tgl_end',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'status',
                    width: 150
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allKursListing
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-cash icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Kurs
                                    <div className="page-title-subheading">Daftar kurs pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                {
                                    this.state.kurs_now_manual === undefined ?
                                        <button className="mb-2 mr-2 btn btn-danger active">Tidak ada kurs berlaku</button>
                                        :
                                        <button className="mb-2 mr-2 btn btn-success active">Kurs berlaku :
                                            <NumberFormat value={Number(this.state.kurs_now_manual)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'  IDR '}></NumberFormat>
                                        </button>
                                }

                                {
                                    this.state.tgl_start_kurs_now_manual === undefined ?
                                        null
                                        : <p className="mb-0">Hingga : {this.state.tgl_end_kurs_now_manual}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah kurs" onClick={this.handleModalInsert}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
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
                                            data={dataKursListing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Kurs */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Kurs</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nilai Kurs</p>
                            <NumberFormat thousandSeparator='.' value={this.state.insert_nilai_kurs}
                                allowNegative={false} decimalSeparator=',' name="insert_nilai_kurs"
                                id="insert_nilai_kurs" onChange={this.handleChange} className="form-control"></NumberFormat>
                            <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            <div id="errorharga" style={{ display: 'none' }}>
                                <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Mulai Berlaku</p>
                            <DateTime
                                isValidDate={this.validationDateMulaiBerlaku}
                                name="dateMulaiBerlaku"
                                value={this.state.dateMulaiBerlaku}
                                input={true}
                                inputProps={{ placeholder: "", onKeyPress: (e) => e.preventDefault() }}
                                onChange={this.handleChangeTimeMulaiBerlaku}>
                            </DateTime>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Berakhir Berlaku</p>
                            <DateTime
                                disabled={this.state.dateMulaiBerlaku === '' ? "disabled" : false}
                                isValidDate={this.validationDateBerakhir}
                                name="dateBerakhir"
                                value={this.state.dateBerakhir}
                                input={true}
                                inputProps={{ placeholder: "", onKeyPress: (e) => e.preventDefault() }}
                                onChange={this.handleChangeTimeBerakhir}>
                            </DateTime>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnInsert}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
                    </ModalFooter>
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
                        <Button color="primary" onClick={this.confirmActionInsertKurs}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Perhatian ada kurs aktif */}
                <Modal size="md" toggle={this.handleModalAttentionKurs} isOpen={this.state.isOpenAttentionKurs} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionKurs}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, terdapat data kurs yang telah ditetapkan dalam rentang waktu </label>
                            <label> {this.state.showDateMulaiBerlaku} hingga {this.state.showDateBerakhir}</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian mulai berlaku < now */}
                <Modal size="md" toggle={this.handleModalAttentionKursMulaiBerlaku} isOpen={this.state.isOpenAttentionKursMulaiBerlaku} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionKursMulaiBerlaku}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, pemilihan waktu mulai berlaku kurs telah berlalu.</label>
                            <label>Harap periksa kolom mulai berlaku.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian berakhir berlaku > now */}
                <Modal size="md" toggle={this.handleModalAttentionKursMulaiBerlakuOnGoing} isOpen={this.state.isOpenAttentionKursMulaiBerlakuOnGoing}
                    backdrop="static" keyboard={false}>
                    <ModalHeader toggle={() => this.handleModalAttentionKursMulaiBerlakuOnGoing("refresh")}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, pemilihan waktu berakhir berlaku kurs telah berlalu.</label>
                            <label>Harap periksa kolom berakhir berlaku.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Detailed Kurs */}
                <Modal size="md" toggle={this.handleModalDetailKurs} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailKurs}>Detail Informasi Kurs</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nilai Kurs</p>
                            <div>
                                <NumberFormat thousandSeparator='.' value={this.state.nilai_kurs_selected}
                                    allowNegative={false} decimalSeparator=',' name="nilai_kurs_selected"
                                    id="nilai_kurs_selected" onChange={this.handleChange} className="form-control"
                                    disabled={true}
                                ></NumberFormat>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Mulai Berlaku</p>
                            <DateTime
                                isValidDate={this.validationDateMulaiBerlakuSelected}
                                name="dateMulaiBerlakuSelected"
                                value={(this.state.dateMulaiBerlakuSelectedForFlag)}
                                input={true}
                                inputProps={{ placeholder: "", onKeyPress: (e) => e.preventDefault(), disabled: "disabled" }}
                                onChange={this.handleChangeTimeMulaiBerlakuSelected}>
                            </DateTime>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Berakhir Berlaku</p>
                            <DateTime
                                isValidDate={this.validationDateBerakhirSelectedOnGoing}
                                name="dateBerakhirSelectedOngoing"
                                value={this.state.dateBerakhirSelectedOngoing}
                                input={true}
                                inputProps={{
                                    placeholder: "", onKeyPress: (e) => e.preventDefault()
                                    // , disabled:"disabled"
                                }}
                                onChange={this.handleChangeTimeBerakhirSelectedOnGoing}>
                            </DateTime>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmUpdate} disabled={this.state.isbtnupdatekurs}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailKurs}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detailed Kurs Not Yet*/}
                <Modal size="md" toggle={this.handleModalDetailKursNotYet} isOpen={this.state.isOpenNotYet} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailKursNotYet}>Detail Informasi Kurs</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nilai Kurs</p>
                            <div>
                                <NumberFormat thousandSeparator='.' value={this.state.nilai_kurs_selected}
                                    allowNegative={false} decimalSeparator=',' name="nilai_kurs_selected"
                                    id="nilai_kurs_selected" onChange={this.handleChange} className="form-control"
                                    disabled={false}
                                ></NumberFormat>
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                <div id="errorharga" style={{ display: 'none' }}>
                                    <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Mulai Berlaku</p>
                            <DateTime
                                isValidDate={this.validationDateMulaiBerlakuSelected}
                                name="dateMulaiBerlakuSelected"
                                value={this.state.dateMulaiBerlakuSelectedForFlag}
                                input={true}
                                inputProps={{ placeholder: "", onKeyPress: (e) => e.preventDefault() }}
                                onChange={this.handleChangeTimeMulaiBerlakuSelected}>
                            </DateTime>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Berakhir Berlaku</p>
                            <DateTime
                                isValidDate={this.validationDateBerakhirSelected}
                                name="dateBerakhirSelected"
                                value={this.state.dateBerakhirSelectedForFlag}
                                input={true}
                                inputProps={{ placeholder: "", onKeyPress: (e) => e.preventDefault() }}
                                onChange={this.handleChangeTimeBerakhirSelected}>
                            </DateTime>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmUpdate} disabled={this.state.isbtnupdatekurs}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailKursNotYet}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update */}
                <Modal size="sm" toggle={this.handleModalConfirmUpdate} isOpen={this.state.isOpenConfirmUpdate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmUpdate}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateKurs}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirmUpdate}>Batal</Button>
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
    getDataKursAdminAPI: (data) => dispatch(getDataKursAdminAPI(data)),
    getKursActiveAPIManual: (data) => dispatch(getKursActiveAPIManual(data)),
    getDataCheckedKurs: (data) => dispatch(getDataCheckedKurs(data)),
    getDataDetailedKursAPI: (data) => dispatch(getDataDetailedKursAPI(data)),
    insertKursSeller: (data) => dispatch(insertKursSeller(data)),
    updateKursSeller: (data) => dispatch(updateKursSeller(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentKurs));