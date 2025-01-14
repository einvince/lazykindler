# -*- coding: utf-8 -*-
#
# Copyright (c) 2014 Pawel Jastrzebski <pawelj@iosphe.re>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

__license__ = 'GPL-3'
__copyright__ = '2014, Pawel Jastrzebski <pawelj@iosphe.re>'

import os
from imghdr import what
from uuid import uuid4

from .KindleUnpack import *


class MOBIFile:
    def __init__(self, path):
        self.path = path
        self.asin = str(uuid4())
        self.check_file()

    def check_file(self):
        if not os.path.isfile(self.path):
            raise OSError('The specified file does not exist!')
        file_extension = os.path.splitext(self.path)[1].upper()
        if file_extension not in ['.MOBI', '.AZW', '.AZW3']:
            raise OSError('The specified file is not E-Book!')
        mobi_header = open(self.path, 'rb').read(100)
        palm_header = mobi_header[:78]
        ident = palm_header[0x3C:0x3C+8]
        if ident != b'BOOKMOBI':
            raise OSError('The specified file is not E-Book!')

    def get_cover_image(self):
        section = Sectionizer(self.path)
        mhlst = [MobiHeader(section, 0)]
        mh = mhlst[0]
        metadata = mh.getmetadata()
        coverid = int(metadata['CoverOffset'][0])
        beg = mh.firstresource
        end = section.num_sections
        imgnames = []
        for i in range(beg, end):
            data = section.load_section(i)
            tmptype = data[:4]
            if tmptype in [
                "FLIS",
                "FCIS",
                "FDST",
                "DATP",
                "SRCS",
                "CMET",
                "FONT",
                "RESC",
            ]:
                imgnames.append(None)
                continue
            if data == chr(0xe9) + chr(0x8e) + "\r\n":
                imgnames.append(None)
                continue
            imgtype = what(None, data)
            if imgtype is None and data[:2] == b'\xFF\xD8':
                last = len(data)
                while data[last-1:last] == b'\x00':
                    last -= 1
                if data[last-2:last] == b'\xFF\xD9':
                    imgtype = "jpeg"
            if imgtype is None:
                imgnames.append(None)
            else:
                imgnames.append(i)
            if len(imgnames)-1 == coverid:
                return data
        raise OSError
