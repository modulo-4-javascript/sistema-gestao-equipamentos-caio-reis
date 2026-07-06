import { Modal } from 'antd'
import styled from 'styled-components'

export const FormModal = styled(Modal)`
  .ant-modal-content {
    overflow: hidden;
    padding: 0;
    border-radius: 8px;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 10%),
      0 4px 6px -4px rgb(0 0 0 / 10%);
  }

  .ant-modal-header {
    margin: 0;
    padding: 20px 24px 21px;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 8px 8px 0 0;
  }

  .ant-modal-title {
    color: #141b2b;
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }

  .ant-modal-close {
    top: 20px;
    width: 24px;
    height: 30px;
    color: #6b7280;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin: 0;
    padding: 17px 24px 16px;
    border-top: 1px solid #d9d9d9;
  }

  .ant-modal-footer .ant-btn {
    height: 40px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
  }

  .ant-modal-footer .ant-btn-default {
    min-width: 105px;
    color: #141b2b;
    border-color: #d9d9d9;
  }

  .ant-modal-footer .ant-btn-primary {
    min-width: 80px;
    border: 0;
    background: linear-gradient(90deg, #003f8f, #005f9e);
    box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
  }

  .ant-modal-footer .ant-btn-primary:hover,
  .ant-modal-footer .ant-btn-primary:focus {
    background: linear-gradient(90deg, #003f8f, #005f9e) !important;
  }

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item-label {
    padding-bottom: 6px;
  }

  .ant-form-item-label > label {
    height: 20px;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .ant-input,
  .ant-select-selector {
    min-height: 40px;
    border-color: #d9d9d9 !important;
    border-radius: 6px !important;
  }

  textarea.ant-input {
    min-height: 100px;
    padding: 13px;
    resize: none;
  }

  .ant-input::placeholder {
    color: rgb(115 119 131 / 60%) !important;
    font-size: 14px;
  }

  .ant-select-selection-placeholder {
    color: #141b2b !important;
    font-size: 14px;
  }

  .ant-form-item-explain-error {
    margin-top: 6px;
    color: #ff4d4f;
    font-size: 14px;
    line-height: 20px;
  }
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const FullField = styled.div`
  grid-column: 1 / -1;
`
