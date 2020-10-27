<div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori BarangX</p>
                                        <ButtonDropdown isOpen={this.state.isOpenKategori} toggle={this.handleKategoriBarang}>
                                            {
                                                (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') ?
                                                    <DropdownToggle caret color="light">
                                                        {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                    </DropdownToggle>
                                                    : (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') ?
                                                        <DropdownToggle caret color="light">
                                                            {/* {this.state.nama_divisi} */}
                                                            {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                        </DropdownToggle>
                                                        : <DropdownToggle caret color="light">
                                                            {/* {this.state.nama_tipe_bisnis} */}
                                                            {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                        </DropdownToggle>
                                            }
                                            {
                                                (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') ?
                                                    <DropdownMenu>
                                                        <DropdownItem disabled>Pilih kategori</DropdownItem>
                                                        {
                                                            this.state.allCategory.map(allCategory => {
                                                                return <DropdownItem onClick={() => this.changeCategoryInserted(allCategory.id, allCategory.nama)}>{allCategory.nama}</DropdownItem>
                                                            })
                                                        }
                                                    </DropdownMenu>
                                                    :
                                                    // false
                                                    <DropdownMenu>
                                                        <DropdownItem disabled>Pilih kategori</DropdownItem>
                                                        {
                                                            this.state.allCategoryKhusus.map(allCategoryKhusus => {
                                                                return <DropdownItem onClick={() => this.changeCategoryInserted(allCategoryKhusus.id, allCategoryKhusus.nama)}>{allCategoryKhusus.nama}</DropdownItem>
                                                            })
                                                        }
                                                    </DropdownMenu>
                                            }
                                        </ButtonDropdown>
                                    </div>
                                    {/* {
                                        this.state.isShowDepartemenList && <div className="position-relative form-group" style={{ marginLeft: '2rem' }}>

                                            <ButtonDropdown isOpen={this.state.isOpenDepartemenList} toggle={this.handleDepartemenSales}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.selected_departmen ? this.state.selected_departmen : 'Pilih Departemen'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem disabled>Pilih Departemen</DropdownItem>
                                                    {
                                                        this.state.departmen_list.map(allDepartemen => {
                                                            return <DropdownItem onClick={() => this.changeDepartemenInserted(allDepartemen.id, allDepartemen.departemen)} >{allDepartemen.departemen}</DropdownItem>
                                                        })
                                                    }
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                        </div>
                                    } */}
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <React.Fragment>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Pilih Departmen</p>
                                            {
                                                this.state.isShowDepartemenList ?
                                                    <ReactMultiSelectCheckboxes options={this.state.departmen_list} style={{ width: '100% !important', border: '1px solid gray !important' }} />
                                                    :
                                                    <Input disabled={true} />
                                            }
                                        </React.Fragment>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Satuan Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenSatuan} toggle={this.handleSatuanBarang}>
                                            <DropdownToggle caret color="light">
                                                {(this.state.satuan_barang_inserted === '') ? 'Pilih satuan' : this.state.satuan_barang_inserted + ' (' + this.state.alias_satuan_barang_inserted + ')'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Pilih satuan</DropdownItem>
                                                {
                                                    this.state.allSatuan.map((allSatuan, index) => {
                                                        return <DropdownItem key={index} onClick={() => this.changeSatuanInserted(allSatuan.id, allSatuan.nama, allSatuan.alias)}>{allSatuan.nama} ({allSatuan.alias})</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Harga Terendah Barang' : 'Harga Terendah Barang (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertMasterBarangTerendah} toggle={this.handleDropDownCurrencyInsertMasterBarangTerendah} style={{ width: '100%' }}>
                                                    <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                        {this.state.default_currency_master_barang_terendah}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarangTerendah('USD')}>USD</DropdownItem>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarangTerendah('IDR')}>IDR</DropdownItem>
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                                {
                                                    (this.state.default_currency_master_barang_terendah === 'IDR') ?
                                                        <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                            name="insert_price_master_barang_terendah" id="insert_price_master_barang_terendah"
                                                            decimalScale={2}
                                                            disabled={this.state.disable_insert_master_price_terendah}
                                                            onChange={this.handleChange} className="form-control" value={this.state.insert_price_master_barang_terendah}></NumberFormat>
                                                        :
                                                        <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.'
                                                            name="insert_price_master_barang_terendah" id="insert_price_master_barang_terendah"
                                                            decimalScale={2}
                                                            disabled={this.state.disable_insert_master_price_terendah}
                                                            value={this.state.insert_price_master_barang_terendah} onChange={this.handleChange} className="form-control"></NumberFormat>
                                                }
                                            </div>
                                            <div id="errorhargaterendah" style={{ display: 'none' }}>
                                                <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsertterendah}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Berat Barang</p>
                                        <Input type="text" name="berat_barang_inserted" id="berat_barang_inserted" className="form-control"
                                            value={this.state.berat_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_berat_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_insert_master_berat}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Harga Tertinggi Barang' : 'Harga Tertinggi Barang (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertMasterBarang} toggle={this.handleDropDownCurrencyInsertMasterBarang} style={{ width: '100%' }}>
                                                    <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                        {this.state.default_currency_master_barang}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarang('USD')}>USD</DropdownItem>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarang('IDR')}>IDR</DropdownItem>
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                                {
                                                    (this.state.default_currency_master_barang === 'IDR') ?
                                                        <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                            name="insert_price_master_barang" id="insert_price_master_barang" onChange={this.handleChange}
                                                            decimalScale={2}
                                                            className="form-control" value={this.state.insert_price_master_barang}
                                                            disabled={this.state.disable_insert_master_price}></NumberFormat>
                                                        :
                                                        <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.' name="insert_price_master_barang"
                                                            decimalScale={2}
                                                            id="insert_price_master_barang" onChange={this.handleChange} value={this.state.insert_price_master_barang}
                                                            disabled={this.state.disable_insert_master_price} className="form-control"></NumberFormat>
                                                }
                                            </div>
                                            <div id="errorharga" style={{ display: 'none' }}>
                                                <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsert}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Volume Barang</p>
                                        <Input type="text" name="volume_barang_inserted" id="volume_barang_inserted" className="form-control"
                                            value={this.state.volume_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_volume_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_insert_master_volume}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <Input type="text" name="insert_master_minimum_pembelian" id="insert_master_minimum_pembelian" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.insert_master_minimum_pembelian}
                                            disabled={this.state.disable_insert_master_minimum_pembelian}
                                            invalid={this.state.empty_insert_master_minimum_pembelian} />
                                        <FormFeedback>{this.state.feedback_insert_master_minimum_pembelian}</FormFeedback>
                                        {/* <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <Input type="text" name="insert_master_minimum_nego" id="insert_master_minimum_nego" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.insert_master_minimum_nego}
                                            disabled={this.state.disable_insert_master_minimum_nego}
                                            invalid={this.state.empty_insert_master_minimum_nego} />
                                        <FormFeedback>{this.state.feedback_insert_master_minimum_nego}</FormFeedback> */}
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <Input type="text" name="insert_master_minimum_nego" id="insert_master_minimum_nego" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.insert_master_minimum_nego}
                                            disabled={this.state.disable_insert_master_minimum_nego}
                                            invalid={this.state.empty_insert_master_minimum_nego} />
                                        <FormFeedback>{this.state.feedback_insert_master_minimum_nego}</FormFeedback>
                                    </div>
                                </div>
                            </div>