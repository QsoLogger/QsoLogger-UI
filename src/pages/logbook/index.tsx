import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
} from 'antd';
import style from './style.module.less';
import { __ } from '@/src/utils/i18n';
import { useLocalState } from '@/src/utils/cache';
import { locatorToLatLng, distance, latLngToLocator } from 'qth-locator';
import { API_URL } from '@/src/config';
import { MobxContext } from '@/src/pages/_app';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import axios from 'axios';

const Logbook = (props) => {
  const [initValues, setInitValues] = useLocalState<any>('logbook', {});
  const from = useRef<HTMLElement>();
  const to = useRef<HTMLElement>();

  const context = useContext(MobxContext) as any;
  console.log({ props, context, process }, process.env.NEXT_PUBLIC_API_URL);

  const [form] = Form.useForm();
  const [size, setSize] = useState<any>();

  const userGrid = Form.useWatch('userGrid', form);
  const remoteGrid = Form.useWatch('remoteGrid', form);

  const handleSubmit = async (values: any) => {
    console.log('Received values of form: ', values);
    const result = await axios
      .post(`/api/qsolog/add`, values)
      .then((res) => res.data)
      .catch((err) => err);
    console.log(result);
  };

  const handleChange = (e: any) => {
    const { id, name, value } = e.target;
    // console.log({ [id]: value }, e.target);
    const newValue = {
      [name || id]: id.endsWith('Callsign') ? value.toUpperCase() : value,
    };
    if (id.endsWith('Grid') && value.length >= 4) {
      try {
        const coord = locatorToLatLng(value);
        const [lat, lng] = coord;
        newValue[id.replace('Grid', 'Gps')] =
          `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;
      } catch (e) {
        console.error(e);
      }
    }
    if (id.endsWith('Gps') && value.split(',').length > 1) {
      const [lat, lng] = value.split(',');
      try {
        const maidenHead = latLngToLocator(parseFloat(lat), parseFloat(lng));
        newValue[id.replace('Gps', 'Grid')] = maidenHead;
      } catch (e) {
        console.error(e);
      }
    }
    const values = {
      ...initValues,
      ...newValue,
    };

    setInitValues(values);
    form.setFieldsValue(values);
  };
  useEffect(() => {
    const formValues = form.getFieldsValue();
    if (navigator.geolocation && !formValues.userGrid && !formValues.userGps) {
      navigator.geolocation.getCurrentPosition((location) => {
        const coords = location.coords;
        // if (coords.accuracy < 10000) {
        const coord = [coords.latitude, coords.longitude];
        try {
          const maidenHead = latLngToLocator(...coord);
          setInitValues({
            ...initValues,
            userGrid: maidenHead,
            userGps: coord.join(','),
          });

          form.setFieldValue('userGps', coord.join(','));
          form.setFieldValue('userGrid', maidenHead);
        } catch (e) {
          //
        }
      });
    }
    window.onresize = (e) =>
      setSize([e.target?.outerWidth, e.target?.outerHeight]);
  }, []);

  const estimateDistance = useMemo(() => {
    if (userGrid?.length >= 4 && remoteGrid?.length >= 4) {
      // console.log(userGrid, remoteGrid, distance(userGrid, remoteGrid));
      try {
        return `~ ${Number(distance(userGrid, remoteGrid)).toFixed()} KM`;
      } catch (e) {
        return '';
      }
    }
    return '';
  }, [userGrid, remoteGrid]);

  const s = useMemo(() => {
    const c1 = from.current?.getBoundingClientRect();
    const c2 = to.current?.getBoundingClientRect();
    const scrollY = window?.scrollY;
    const scrollX = window?.scrollX;
    if (c1 && c2 && estimateDistance) {
      // console.log(estimateDistance, c1, c2);

      if (Math.abs(c2.y - c1.y) < 10)
        return [
          c1.x + c1.width + 12 + scrollX,
          c1.y + c1.height / 2 + scrollY,
          1,
          1,
          Number(Math.abs(c2.x - c1.x) - c1.width * 2),
          Math.abs(c2.y - c1.y) + 1,
        ];
    }
    return undefined;
  }, [estimateDistance, window?.scrollY, window?.scrollX, size]);

  return (
    <div>
      <h1>QSO Logger</h1>
      {s && (
        <svg
          width={s[4]}
          height={s[5] + 30}
          style={{
            position: 'absolute',
            zIndex: 99,
            top: s[1],
            left: s[0],
          }}
        >
          <line
            x1={s[2]}
            y1={s[3]}
            x2={s[4]}
            y2={s[5]}
            stroke="grey"
            strokeWidth={2}
            strokeDasharray={'10,6'}
          />
          <g fontSize="20" fill="black" stroke="none" textAnchor="middle">
            <text x={(s[2] + s[4]) / 2} y={s[3] + 20}>
              {estimateDistance}
            </text>
          </g>
        </svg>
      )}
      <Form
        form={form}
        className={style.form}
        layout="inline"
        onFinish={handleSubmit}
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 0 }}
        onChange={handleChange}
        initialValues={initValues}
      >
        <Card title={__('Local')} className={style.card}>
          <Card.Grid className={style.grid}>
            <Form.Item label={__('Callsign')} name={'userCallsign'}>
              <Input placeholder="Callsign" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userPwr" label={__('Power')}>
              <InputNumber
                max={9999}
                min={1}
                maxLength={4}
                style={{ width: 120 }}
                addonAfter="W"
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userQsl" label={__('QSL')}>
              <Radio.Group
                name="userQsl"
                optionType="button"
                options={[
                  { value: '0', label: __('No Need') },
                  { value: '1', label: __('Not Sent') },
                  { value: '2', label: __('Sent') },
                  { value: '3', label: __('Received') },
                ]}
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userRst" label={__('RST')}>
              <Input placeholder="Signal Report" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userGrid" label={__('Grid')}>
              <Input
                placeholder="Maidenhead Grid"
                addonAfter={<ArrowRightOutlined ref={from} />}
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userItu" label={__('ITU Zone')}>
              <InputNumber placeholder="ITU Zone" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userCq" label={__('CQ Zone')}>
              <InputNumber placeholder="CQ Zone" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userQth" label={__('QTH')}>
              <Input placeholder="QTH" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userGps" label={__('GPS')}>
              <Input placeholder="GPS" addonAfter="WGS84" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userRig" label={__('Rig')}>
              <Input placeholder="Transmitter / receiver / transceiver" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="userAnt" label={__('Antenna')}>
              <Input placeholder="Antenna" />
            </Form.Item>
          </Card.Grid>
        </Card>
        <Card title={'Remote'} className={style.card}>
          <Card.Grid className={style.grid}>
            <Form.Item label={__('Callsign')} name={'remoteCallsign'}>
              <Input placeholder="callsign" onInput={(e) => {}} />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remotePwr" label={__('Power')}>
              <InputNumber
                max={9999}
                min={1}
                maxLength={4}
                style={{ width: 120 }}
                addonAfter="W"
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteQsl" label={__('QSL')}>
              <Radio.Group
                name="remoteQsl"
                optionType="button"
                options={[
                  { value: '0', label: __('No Need') },
                  { value: '1', label: __('Not Sent') },
                  { value: '2', label: __('Sent') },
                  { value: '3', label: __('Received') },
                ]}
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteRst" label={__('RST')}>
              <Input placeholder="Signal Report" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item
              name="remoteGrid"
              label={
                <Space>
                  <ArrowLeftOutlined ref={to} />
                  {__('Grid')}
                </Space>
              }
            >
              <Input placeholder="Maidenhead Grid" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteItu" label={__('ITU Zone')}>
              <InputNumber placeholder="ITU Zone" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteCq" label={__('CQ Zone')}>
              <InputNumber placeholder="CQ Zone" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteQth" label={__('QTH')}>
              <Input placeholder="QTH" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteGps" label={__('GPS')}>
              <Input placeholder="GPS" addonAfter="WGS84" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteRig" label={__('Rig')}>
              <Input placeholder="Transmitter / receiver / transceiver" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="remoteAnt" label={__('Antenna')}>
              <Input placeholder="Antenna" />
            </Form.Item>
          </Card.Grid>
        </Card>
        <Card className={style.footer} title="Common">
          <Card.Grid className={style.grid}>
            <Form.Item name="band" label="Band">
              <Radio.Group
                name="band"
                optionType="button"
                options={[
                  { value: 'WFM', label: __('WFM') },
                  { value: 'NFM', label: __('NFM') },
                  { value: 'AM', label: __('AM') },
                  { value: 'CW', label: __('CW') },
                  { value: 'LSB', label: __('LSB') },
                  { value: 'USB', label: __('USB') },
                ]}
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="freq" label={__('Freq')}>
              <InputNumber step={0.001} addonAfter="MHz" />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item name="comment" label={__('Comment')}>
              <Input.TextArea />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item label={__('Datetime')}>
              <DatePicker
                showTime
                onChange={(datetime) =>
                  setInitValues({
                    ...initValues,
                    callTimestamp: Number(datetime),
                  })
                }
              />
            </Form.Item>
          </Card.Grid>
          <Card.Grid className={style.grid}>
            <Form.Item
              wrapperCol={{
                offset: 6,
              }}
              style={{ marginTop: 20 }}
            >
              <Button type="primary" htmlType="submit" size="large">
                {__('Save')}
              </Button>
            </Form.Item>
          </Card.Grid>
        </Card>
      </Form>
    </div>
  );
};

export default Logbook;
