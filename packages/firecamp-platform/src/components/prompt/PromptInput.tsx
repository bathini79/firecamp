import { FC, useState } from 'react';
import { Button, Input, Modal, ProgressBar, TabHeader } from '@firecamp/ui-kit';
import { IPromptInput } from './types';

const _texts: IPromptInput['texts'] = {
  btnOk: 'Create',
  btnOking: 'Creating...',
  btnCancle: 'Cancle',
};

export const PromptInput: FC<IPromptInput> = ({
  header,
  lable = 'Name',
  placeholder,
  texts,
  value,
  onClose,
  validator,
  executor,
  onResolve,
  onError,
}) => {
  const [state, setState] = useState({
    isOpen: true,
    isExecuting: false,
    value,
    error: '',
  });
  const _close = (e) => {
    setState((s) => ({ ...s, isOpen: false }));
    setTimeout(() => {
      onClose(e);
    }, 500);
  };
  const _onChangeValue = (e) => {
    const { value } = e.target;
    setState((s) => ({ ...s, value, error: '' }));
  };
  const _onClickOk = async (e) => {
    e.preventDefault();
    const value = state.value.trim();
    let _validator: { isValid: boolean; message?: string } = { isValid: true };
    if (typeof validator == 'function') _validator = validator(value);
    // console.log(_validator, '_validator');
    if (_validator.isValid == false) {
      setState((s) => ({ ...s, error: _validator.message }));
      if (typeof onError == 'function') onError(new Error(_validator.message));
    } else {
      if (typeof executor == 'function') {
        setState((s) => ({ ...s, error: '', isExecuting: true }));
        executor(value)
          .then((res) => {
            onResolve(res);
            // finally close the prompt on success
            setState((s) => ({ ...s, isOpen: false, isExecuting: false }));
          })
          .catch((e) => {
            if (typeof onError == 'function') {
              console.error(e)
              onError(e);
            }
            setState((s) => ({
              ...s,
              isExecuting: false,
              error: e?.response?.data?.message || e.message,
            }));
          });
      } else {
        onResolve(value);
        // finally close the prompt on success
        setState((s) => ({ ...s, error: '', isOpen: false }));
      }
    }
  };

  texts = { ..._texts, ...texts };
  return (
    <Modal
      isOpen={state.isOpen}
      onClose={_close}
      height="250px"
      width={'400px'}
    >
      <Modal.Body>
        <ProgressBar active={state.isExecuting} />
        <div className="p-6">
          <label className="text-sm font-semibold leading-3 block text-appForegroundInActive uppercase w-full relative mb-2">
            {header || `THIS IS A HEADER PLACE`}
          </label>
          <div className="mt-4">
            <Input
              autoFocus={true}
              label={lable}
              placeholder={placeholder}
              name={'prompInput'}
              value={state.value}
              onChange={_onChangeValue}
              onKeyDown={() => {}}
              onBlur={() => {}}
              error={state.error}
            />
          </div>
          <TabHeader className="px-4">
            <TabHeader.Right>
              <Button
                text={texts?.btnCancle || `Cancel`}
                onClick={_close}
                secondary
                transparent
                ghost
                sm
              />
              <Button
                text={
                  state.isExecuting ? texts?.btnOking : texts?.btnOk || 'Create'
                }
                onClick={_onClickOk}
                disabled={state.isExecuting}
                primary
                sm
              />
            </TabHeader.Right>
          </TabHeader>
        </div>
      </Modal.Body>
    </Modal>
  );
};
