#include "sensor.h"

extern "C" {
    #include "i2c.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "esp_log.h"
}

void readPressureTask(void *params)
{
    for (;;)                                                                          
    {
        int32_t sensor_data[2] = {0};
        read_sensor(sensor_data);
        ESP_LOGI("", "%.2f°C, %.1f hPa", (float)*sensor_data/100, (float)*(sensor_data+1)/10);
        //std::cout << "temperature: " << *sensor_data << " pressure: " << *(sensor_data + 1) << std::endl;
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

extern "C" void app_main()
{
    xTaskCreate(readPressureTask, "read pressure task", 2048, nullptr, 10, nullptr);
}