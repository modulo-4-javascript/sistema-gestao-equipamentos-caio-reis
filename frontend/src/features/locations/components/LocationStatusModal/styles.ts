import { Modal } from 'antd'
import styled from 'styled-components'

export const StatusModal = styled(Modal)`
  .ant-modal-content {
    overflow: hidden;
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 6px 16px -6px rgb(0 0 0 / 8%);
  }

  .ant-modal-header {
    margin: 0;
    padding: 16px 20px 12px;
    border-radius: 8px 8px 0 0;
  }

  .ant-modal-title {
    color: #141b2b;
    font-size: 18px;
    font-weight: 700;
    line-height: normal;
  }

  .ant-modal-close {
    top: 14px;
    width: 28px;
    height: 28px;
    color: #6b7280;
  }

  .ant-modal-body {
    padding: 4px 20px 0;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin: 0;
    padding: 12px 20px 16px;
  }

  .ant-modal-footer .ant-btn {
    height: 36px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
  }

  .ant-modal-footer .ant-btn-default {
    min-width: 96px;
    color: #141b2b;
    border-color: #d9d9d9;
  }

  .ant-modal-footer .ant-btn-primary {
    min-width: 80px;
    border: 0;
    background: linear-gradient(90deg, #003f8f, #007c8c);
  }

  .ant-modal-footer .ant-btn-primary:hover,
  .ant-modal-footer .ant-btn-primary:focus {
    background: linear-gradient(90deg, #003f8f, #007c8c) !important;
  }

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item-label {
    padding-bottom: 6px;
  }

  .ant-form-item-label > label {
    height: 16px;
    color: #111827;
    font-size: 13px;
    font-weight: 500;
    line-height: normal;
  }

  .ant-select-selector {
    min-height: 40px;
    border-color: #d9d9d9 !important;
    border-radius: 6px !important;
  }

  .ant-select-selection-placeholder {
    color: #6b7280 !important;
    font-size: 14px;
  }
`

export const CurrentStatusText = styled.p`
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: normal;
`
