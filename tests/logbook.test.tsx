/**
 * @jest-environment jsdom
 */
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import Logbook from '@src/pages/logbook';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import './matchMedia';

describe('test qso logbook render', () => {
  const rendered = render(<Logbook />);
  it('test callsign render', async () => {
    expect(rendered.queryAllByTitle('呼号').length).toBe(2);
  });

  it('test none exist text', async () => {
    expect(rendered.queryByLabelText('some label that is not exist')).toBe(
      null
    );
  });
});
