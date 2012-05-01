# -*- coding: utf-8 -*-

require 'rubygems'
require 'crxmake'
require 'json'

NAME          = 'make-booth-stream'
PEM           = File.join(File.dirname(__FILE__), "#{NAME}.pem")
MANIFEST_PATH = File.join(File.dirname(__FILE__), 'src', 'manifest.json')
MANIFEST      = JSON.parse(open(MANIFEST_PATH).read).freeze
VERSION       = MANIFEST['version']

namespace :pkg do
  desc 'create crx'
  task :crx do
    mkdir_p 'pkg' unless File.exists? 'pkg'
    package = "pkg/#{NAME}.crx"
    rm package if File.exists? package
    CrxMake.make(
      :ex_dir     => 'src',
      :pkey       => PEM,
      :crx_output => package,
      :verbose    => true,
      :ignoredir  => /^\.git$/
    )
  end

  desc 'create zip for Google Extension Gallery'
  task :zip do
    mkdir_p 'pkg' unless File.exists? 'pkg'
    package = "pkg/#{NAME}.zip"
    rm package if File.exists? package
    CrxMake.zip(
      :ex_dir     => 'src',
      :pkey       => PEM,
      :zip_output => package,
      :verbose    => true,
      :ignoredir  => /^\.git$/
    )
  end
end
