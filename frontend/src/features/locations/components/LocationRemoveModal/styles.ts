import { Modal } from 'antd'
import styled from 'styled-components'

export const RemoveModal = styled(Modal)`
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
    padding: 4px 20px 20px;
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

  .ant-modal-footer .ant-btn-primary,
  .ant-modal-footer .ant-btn-primary.ant-btn-dangerous {
    min-width: 88px;
    border: 0;
    background: linear-gradient(90deg, #ff4d4f, #d9363e);
  }

  .ant-modal-footer .ant-btn-primary:hover,
  .ant-modal-footer .ant-btn-primary:focus {
    background: linear-gradient(90deg, #ff4d4f, #d9363e) !important;
  }
`

export const Message = styled.p`
  margin: 0;
  color: #141b2b;
  font-size: 14px;
  line-height: normal;
`

export const Hint = styled.p`
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: normal;
`
