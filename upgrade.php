<?php
namespace SECTIONED;

/*
 * used for managing upgrade process between versions
 */
class Upgrade{

    var $user_version;
    var $plugin_version = 0.1;
    var $option_name = 'jagmp_ver';

    public function __construct(){

        $this->user_version = get_option($this->option_name);

        if(!$this->user_version){
            $this->user_version = 0;
        }

        /*
         * run all available upgrade functions
         */
        if($this->user_version < $this->plugin_version){
            while($this->user_version < $this->plugin_version){
                $this->user_version = $this->user_version + .1;
                $function = 'version_' . str_replace('.', '', $this->user_version);

                if(method_exists($this, $function)){
                    call_user_func('MultipleHeaderImages\Upgrade::' . $function);
                }
            }

            update_option($this->option_name, $this->user_version); // update user version
        }

    }

}