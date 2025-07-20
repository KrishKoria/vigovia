package config

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	PDF      PDFConfig      `mapstructure:"pdf"`
	ChromeDP ChromeDPConfig `mapstructure:"chromedp"`
	Logging  LoggingConfig  `mapstructure:"logging"`
}

type ServerConfig struct {
	Port        string `mapstructure:"port"`
	Host        string `mapstructure:"host"`
	TemplateDir string `mapstructure:"template_dir"`
}

type PDFConfig struct {
	StoragePath   string        `mapstructure:"storage_path"`
	MaxFileAge    time.Duration `mapstructure:"max_file_age"`
	PageFormat    string        `mapstructure:"page_format"`
	Orientation   string        `mapstructure:"orientation"`
	DefaultMargin MarginConfig  `mapstructure:"margin"`
}

type MarginConfig struct {
	Top    string `mapstructure:"top"`
	Bottom string `mapstructure:"bottom"`
	Left   string `mapstructure:"left"`
	Right  string `mapstructure:"right"`
}

type ChromeDPConfig struct {
	Timeout           time.Duration `mapstructure:"timeout"`
	DisableWebSecurity bool          `mapstructure:"disable_web_security"`
	Headless          bool          `mapstructure:"headless"`
}

type LoggingConfig struct {
	Level  string `mapstructure:"level"`
	Format string `mapstructure:"format"`
}

var AppConfig *Config

func LoadConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")

	// Set default values
	setDefaults()

	// Read environment variables
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		// If config file is not found, use defaults
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return err
		}
	}

	AppConfig = &Config{}
	return viper.Unmarshal(AppConfig)
}

func setDefaults() {
	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.host", "0.0.0.0")
	
	viper.SetDefault("pdf.storage_path", "./storage/pdfs")
	viper.SetDefault("pdf.max_file_age", "168h") // 7 days
	viper.SetDefault("pdf.page_format", "A4")
	viper.SetDefault("pdf.orientation", "portrait")
	viper.SetDefault("pdf.margin.top", "0.5in")
	viper.SetDefault("pdf.margin.bottom", "0.5in")
	viper.SetDefault("pdf.margin.left", "0.5in")
	viper.SetDefault("pdf.margin.right", "0.5in")
	
	viper.SetDefault("chromedp.timeout", "30s")
	viper.SetDefault("chromedp.disable_web_security", true)
	viper.SetDefault("chromedp.headless", true)
	
	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.format", "json")
}
