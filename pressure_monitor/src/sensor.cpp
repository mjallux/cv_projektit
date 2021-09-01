#include <math.h>

extern "C" {
    #include "i2c.h"
}

void compensate(const uint32_t *calibration, const uint32_t *adc_data, int32_t *compensated_data)
{

    //all math comes from mfr datasheet: https://www.te.com/commerce/DocumentDelivery/DDEController?Action=srchrtrv&DocNm=MS5803-14BA&DocType=Data+Sheet&DocLang=English

    //works if i inline dt but overflows otherwise idk dude
    auto dt = (*adc_data - (*(calibration + 4) * pow(2, 8)));
    int32_t temperature = 2000 + (dt * (*(calibration + 5))) / pow(2, 23);
    
    auto offset = *(calibration + 1) * pow(2, 16) + (*(calibration + 3) * dt) / pow(2, 7);
    auto sensitivity = *calibration  * pow(2, 15) + (*(calibration + 2) * dt) / pow(2, 9);
    int32_t pressure = (*(adc_data + 1) * sensitivity / pow(2, 21) - offset)  / pow(2, 15);
    
    *compensated_data = temperature;
    *(compensated_data + 1) = pressure;
}

void read_sensor(int32_t *arr)
{
    i2c_init();

    uint32_t adc_data[2] = {0};
    uint32_t calibration[6] = {0};

    // read sensor internal rom compensation values //
    i2c_write_byte(0xA2, 0);
    i2c_read_bytes(&calibration[0], 2);

    i2c_write_byte(0xA4, 0);
    i2c_read_bytes(&calibration[1], 2);

    i2c_write_byte(0xA6, 0);
    i2c_read_bytes(&calibration[2], 2);

    i2c_write_byte(0xA8, 0);
    i2c_read_bytes(&calibration[3], 2);

    i2c_write_byte(0xAA, 0);
    i2c_read_bytes(&calibration[4], 2);

    i2c_write_byte(0xAC, 0);
    i2c_read_bytes(&calibration[5], 2);
    // --------------------------------------------- //

    //instruction 0x58 = 4096 adc temperature conversion
    //instruction 0x48 = 4096 adc pressure conversion
    //instruction 0x00 = adc output memory to read memory
    i2c_write_byte(0x58, 20);
    i2c_write_byte(0x00, 0);

    //puts adc data into temperature_data var
    i2c_read_bytes(adc_data, 3);

    i2c_write_byte(0x48, 20);
    i2c_write_byte(0x00, 0);

    i2c_read_bytes((adc_data + 1), 3);

    //compensate & turn data into human undestandable format
    compensate(calibration, adc_data, arr);

    i2c_destroy();
}